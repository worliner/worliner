/** 
 * 利用可能な暗号化アルゴリズムは下記のコマンドで調べることができます。 
 * > $ openssl list-message-digest-algorithms # openssl command in CentOS release 6.2 (Final) 
 * > DSA 
 * > DSA-SHA 
 * > DSA-SHA1 => DSA 
 * > DSA-SHA1-old => DSA-SHA1 
 * > DSS1 => DSA-SHA1 
 * > MD4 
 * > MD5 
 * > RIPEMD160 
 * > RSA-MD4 => MD4 
 * > RSA-MD5 => MD5 
 * > RSA-RIPEMD160 => RIPEMD160 
 * > RSA-SHA => SHA 
 * > RSA-SHA1 => SHA1 
 * > RSA-SHA1-2 => RSA-SHA1 
 * > RSA-SHA224 => SHA224 
 * > RSA-SHA256 => SHA256 
 * > RSA-SHA384 => SHA384 
 * > RSA-SHA512 => SHA512 
 * > SHA 
 * > SHA1 
 * > SHA224 
 * > SHA256 
 * > SHA384 
 * > SHA512 
 * > DSA 
 * > DSA-SHA 
 * > dsaWithSHA1 => DSA 
 * > dss1 => DSA-SHA1 
 * > MD4 
 * > md4WithRSAEncryption => MD4 
 * > MD5 
 * > md5WithRSAEncryption => MD5 
 * > ripemd => RIPEMD160 
 * > RIPEMD160 
 * > ripemd160WithRSA => RIPEMD160 
 * > rmd160 => RIPEMD160 
 * > SHA 
 * > SHA1 
 * > sha1WithRSAEncryption => SHA1 
 * > SHA224 
 * > sha224WithRSAEncryption => SHA224 
 * > SHA256 
 * > sha256WithRSAEncryption => SHA256 
 * > SHA384 
 * > sha384WithRSAEncryption => SHA384 
 * > SHA512 
 * > sha512WithRSAEncryption => SHA512 
 * > shaWithRSAEncryption => SHA 
 * > ssl2-md5 => MD5 
 * > ssl3-md5 => MD5 
 * > ssl3-sha1 => SHA1 
 * > whirlpool 
 */

var crypto = require('crypto'); 
const secret = 'hatiroku'; // 秘密キー   
  
/** 
 * 指定されたアルゴリズム(md5, sha256 ...) とキー(なんでもOK)でHMACを計算する。 
 *  
 * @param {String} secret 秘密キー 
 * @param {String} key キー（何でもOK） 
 * @param {String} algorithm アルゴリズム(md5, sha256 ...) 
 * @returns {String}  
 */  
var createHmac = function(secret, key, algorithm) {  
    algorithm = algorithm || 'sha256';  
    var hmac = crypto.createHmac(algorithm, secret);  
    hmac.update(key);  
    return hmac.digest('hex');  
};  
  
/** 
 * 指定されたアルゴリズム(md5, sha256 ...) とキー(なんでもOK)でハッシュ値を求める。 
 *  
 * @param {String} key キー(なんでもOK) 
 * @param {String} algorithm アルゴリズム(md5, sha256 ...) 
 * @returns {String}  
 */  
var createHash = function(key, algorithm) {  
    algorithm = algorithm || 'sha256';  
    return crypto.createHash(algorithm).update(key).digest('hex');  
};  
  
  
/** 
 * 指定されたサイズ数のユニークIDを生成します。 
 * ※ crypto の randomBytes関数はnode v0.6からの機能になります。(node <= 0.6) 
 * @param {int} size サイズ  
 * @returns {String}  
 */  
var randuid = function(size) {  
    size = size || 32;  
    return crypto.randomBytes(Math.ceil(size * 3 / 4)).toString('base64').slice(0, size);  
};  
  
/** 
 * 指定された文字列と生成したいサイズ数でユニークIDを生成します。 
 *  
 * @param {int} size サイズ 
 * @param {String} base 利用したい文字's 
 * @returns {String}  
 */  
var uid = function(size, base) {  
    size = size || 32;  
    base = base || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';  
    var len = base.length;  
  
    var buf = [];  
    for (var i = 0; i < size; ++i) {  
        buf.push(base[Math.floor(Math.random() * len)]);  
    }  
    return buf.join('');  
};  
  
/*
for (var i = 0; i < 3; i++) {  
    var now = new Date().getTime().toString();  
  
    console.log('\n\n### -- ' + i + ', now: ' + now);  
    console.log('\n# -- createHmac()');  
    console.log('md5    : ' + createHmac(secret, now, 'md5'));  
    console.log('sha256 : ' + createHmac(secret, now));  
  
    console.log('\n# -- createHash()');  
    console.log('md5    : ' + createHash(now, 'md5'));  
    console.log('sha256 : ' + createHash(now));  
  
    console.log('\n# -- randuid()');  
    console.log('default : ' + randuid());  
    var ret1 = randuid(1);  
    console.log('12      : ' + ret1 + ' , len:' + ret1.length);  
  
    console.log('\n# -- uid()');  
    console.log('default : ' + uid());  
    var ret2 = uid(12, 'ABCDEFG');  
    console.log('12      : ' + ret2 + ' , len:' + ret2.length);  
}; 
*/ 