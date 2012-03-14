var http = require('http')
  , querystring = require('querystring')
  , Vectogram = require('../lib/vectogram');

//
//  Client
//
var Client = function (opts) {
  this.opts = opts;
};

Client.prototype.makeRequest = function (imgUrl, pathonly) {
  var params = { pathonly: pathonly };

  this.opts.headers = { 'connection': 'keep-alive' };
  this.opts.method = 'GET';
  this.opts.path = '/v1/' + imgUrl + '?' + querystring.stringify(params);

  var req =  http.request(this.opts, function (res) {
    var reply = '';

    console.log('statusCode:', res.statusCode);
    
    res.on('data', function (chunk) {
      reply += chunk;
    });
    res.on('end', function () {

      var fd = require('path').resolve(__dirname, '../files/testpath.txt');
      require('fs').writeFileSync(fd, reply);

    });
  });
  req.on('error', function (e) {
    console.log('CLIENT error:', e);
  });
  req.end();
};

//
//tests
//

var opts = { port: 8000, host: '127.0.0.1' };

var server = new Vectogram(opts)
  , client = new Client(opts);

//client.makeRequest('http://jquery.com/demo/thickbox/images/plant4.jpg', true);
//client.makeRequest('http://jquery.com/demo/thickbox/images/plant4.jpg', false);
//client.makeRequest('http://upload.wikimedia.org/wikipedia/commons/d/d5/Dds40-097_large.jpeg', true)
//client.makeRequest('http://t0.gstatic.com/images?q=tbn:ANd9GcRrBs5epg4w79Ral9TeQ40u2CFQGipgz_T1VH6YwnbglT1A8un_bszOByKqCg', true);
client.makeRequest('http://www.gly.uga.edu/railsback/11111misc/SizeofThings36Large.jpeg', true);
//client.makeRequest('http://www.google.com/images/srpr/logo3w.png', true);
//client.makeRequest(undefined, undefined)