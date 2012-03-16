var assert = require('assert')
  , http = require('http')
  , querystring = require('querystring')
  , Vectogram = require('../lib/vectogram');

//
//  Client
//
var Client = function (opts) {
  this.opts = opts;
};

Client.prototype.makeRequest = function (imgUrl, params, cb) {
  this.opts.headers = { 'connection': 'keep-alive' };
  this.opts.method = 'GET';
  this.opts.path = '/v1/' + imgUrl + '?' + querystring.stringify(params);

  var req =  http.request(this.opts, function (res) {
    var reply = '';
    res.on('data', function (chunk) {
      reply += chunk;
    });
    res.on('end', function () {
      cb(null, res.statusCode, reply);
    });
  });
  req.on('error', function (err) {
    cb(err, res.statusCode, reply);
  });
  req.end();
};

function checkJSON (err, statusCode, reply) {
  assert.equal(statusCode, 200);
  assert.doesNotThrow(
    function () {
      JSON.parse(reply);
    },
    Error
  );
};

function checkJSONP (err, statusCode, reply) {
  assert.equal(statusCode, 200);
};

//
//tests
//

var opts = { port: 8000, host: '127.0.0.1' };

var server = new Vectogram(opts)
  , client = new Client(opts);

client.makeRequest('http://jquery.com/demo/thickbox/images/plant4.jpg', { pathonly: 'true' }, checkJSON);
client.makeRequest('http://www.google.com/images/srpr/logo3w.png', { pathonly: 'false' }, checkJSON);

client.makeRequest('http://jquery.com/demo/thickbox/images/plant4.jpg', { pathonly: 'true', callback: 'myCallback' }, checkJSONP);
client.makeRequest('http://www.google.com/images/srpr/logo3w.png', { pathonly: 'false', callback: 'myCallback' }, checkJSONP);