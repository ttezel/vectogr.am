//
//  Vectogram Server
//
//  takes incoming requests for svg conversion and responds with svg output
//
var http = require('http')
  , querystring = require('querystring')
  , Converter = require('./converter')

var VERSION = 1;  //api version

var Vectogram = function (opts) {
  var self = this;

  //regex for extracting params from request
  var rImgUrl = new RegExp('\\/v' + VERSION + '\\/(\\S+)\\?\\S+$')
    , rQueryStr = /\?(\S+)$/;

  this.server = http.createServer(function (req, res) {
    
    console.log('hit server')

    var imgMatch = rImgUrl.exec(req.url);

    if(!imgMatch) {;
      res.writeHead(400); //bad request format
      res.end('must specify image url');
      return;
    }

    var imgUrl = imgMatch[1]
      , query = rQueryStr.exec(req.url)
      , options = querystring.parse(query[1]);

    var converter = new Converter();
    
    converter.svg(imgUrl, options, function (err, svg) {

      if(err) {
        if(err.code === 1) {
          res.writeHead(400);
          res.end('image could not be retrieved from url.');
        } else if(err.code === 2) {
          res.writeHead(500);
          res.end();
        }
      }
      //send back data to client
      res.writeHead(200);
      var output = {
          original_image: imgUrl
        , svg: svg
      }
      res.end(JSON.stringify(output));
    });
  });
  this.server.listen(opts.port, opts.host);
}

module.exports = Vectogram;