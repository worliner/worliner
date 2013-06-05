var util    = require("util");
var urlutil = require("url");
var http    = require('http');
var https   = require('https');
var Iconv   = require("iconv").Iconv;
var cheerio = require('cheerio');
var fs = require('fs');
var googleSafe = require('safe-browse');
var charsetDetector = require("node-icu-charset-detector");

const API_KEY = 'ABQIAAAAKl1hv9gunT7c7fghyrO54xTfFarIsvho0mhMeiZmG-x8X50Gng';
var web = new Object();
var CharsetMatch    = charsetDetector.CharsetMatch;

var getWebPageTitle = function(url, callback) {
  var urlElements = urlutil.parse(url, false);
  web.url = url;
  web.favicon_url = util.format("http://%s/favicon.ico", urlElements.host);
  var requester = (urlElements.protocol === 'https:') ? https : http;

  var options = {
    host: urlElements.hostname,
    port: urlElements.port,
    path: urlElements.path,
    headers: {'user-agent': 'node title fetcher'}
};

  var request = requester.get(options, function(response) {
    var binaryText = '';
    response.setEncoding('binary');

    response.on('data', function(chunk) {
      binaryText += chunk
    });

    response.on('end',function() {
      if(binaryText)
      {
      var textBuffer = new Buffer(binaryText, 'binary');
      var charsetMatch = new CharsetMatch(textBuffer);
      var text = bufferToString(textBuffer, charsetMatch.getName());
      var $ = cheerio.load(text);


      var reHead = new RegExp('<head[\\s>]([\\s\\S]*?)<\\/head>', 'i');
      var reCharset = new RegExp('<meta[^>]*[\\s;]+charset\\s*=\\s*["\']?([\\w\\-_]+)["\']?', 'i');
      var reDesc = new RegExp('<meta.*?name="description".*?content="(.*?)".*?>|<meta.*?content="(.*?)".*?name="description".*?>', 'i');

      web.title = $('title').text().replace(/\n/g, '');
      web.title = (web.title === '') ? util.format("couldn't find title from %s", url) : web.title;
      web.charset = charsetMatch.getName();
      web.head = text.match(reHead);
      if(text.match(reDesc) && text.match(reDesc).length > 0)
        web.description = text.match(reDesc)[1];
      web.body = $('')

      var api = new googleSafe.Api(API_KEY);
      api.lookup(web.url)
      .on('success', function(data){
        web.safety = true;
        callback(web);
      })
      .on('error', function(data){
        web.safety = false;
        callback(web);
      });
    }
    else
      callback(web);
    });
  });
  request.setTimeout(2000, function() {
    request.abort()
  });
  request.on('error', function(error) {
    callback(util.format("couldn't fetch web page from %s", url));
  });
};

var bufferToString = function(buffer, charset) {
  try {
    return buffer.toString(charset);
  } catch(error) {
    charsetConverter = new Iconv(charset, "utf8");
    return charsetConverter.convert(buffer).toString();
  }
};
/*
var url = process.argv[2];
if(!url) console.log("invaled url")
getWebPageTitle(url, function(web) {
  console.log(web.url);
  console.log("タイトル:" + web.title);
  console.log("文字コード:" + web.charset);
  console.log("説明文:" + web.description);
  console.log("faviconURL:" + web.favicon_url);
  console.log("GoogleSafeBrowse:" + web.safety);
  var fav = require('./favicon.js');
  fav.loadBase64Image(web.favicon_url, function (uri) {
    web.favicon_uri = uri;
    console.log( "<img src=\"%s\"/>", uri);
  });
});
*/
exports.getWebData = function (url, opt_callback){
  getWebPageTitle(url, function(web) {
    var fav = require('./favicon.js');
    fav.loadBase64Image(web.favicon_url, function (uri) {
    if(uri) web.favicon_uri = uri;
    if(opt_callback) opt_callback(web);
  });
  });
}

