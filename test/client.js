var http = require('http')
  , Server = require('../lib/server')

//
//  Client
//
var Client = function () {
  this.opts = {
      host: '127.0.0.1'
    , port: 8000
  }
}

Client.prototype.makeRequest = function (apiKey, authHash, imgUrl) {
  this.opts.path = '/' + apiKey + '/' + authHash + '/' + imgUrl;

  var req =  http.get(this.opts, function (res) {
    console.log('client got response', res)
  });

  req.on('error', function (e) {
    console.log('http client error:', e)
  });
}

//
//tests
//
var server = new Server()
  , client = new Client();

client.makeRequest('foo', 'bar', 'http://findicons.com/files/icons/1306/nc_lighthouses/128/currituck_beach.png');