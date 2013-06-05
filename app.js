
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , scrape = require('./scrape')
  , url = require('url');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.get('/:id', function(request, response){
  var pathurl = url.parse(request.params.id).pathname;
  console.log(pathurl);
  scrape.getWebData("http://"+pathurl, function(data){
  console.log("URL: " + data.url);
  console.log("TITLE: " + data.title);
  console.log("Description: " + data.description);
  console.log("Charset: " + data.charset);
  console.log("GoogleSafeBrowse: " + data.safety);
  console.log("faviconURI: " + data.favicon_uri);
  response.send(data);
  });
});

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
//app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});