//
//  Vectogram Server
//
//  takes incoming requests for svg conversion and responds with svg output
//
var http = require('http')
  , querystring = require('querystring')
  , Converter = require('./converter')

var VERSION = 1;  //api version

//regex's for extracting params from request
var rImgUrl = new RegExp('\\/v' + VERSION + '\\/(\\S+)\\?\\S+$')
  , rQueryStr = /\?(\S+)$/;

var Vectogram = function (opts) {
  this.server = http.createServer(function (req, res) {
    req.connection.setKeepAlive(true);
    req.connection.setTimeout(0);

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
          res.write('\nimage could not be retrieved from url.');
        } else {
          console.log('SERVER error:', err);
          res.writeHead(500);
        }
        res.end();
        return;
      }
      //all good - send back data to client
      res.writeHead(200);
      var output = {
          original_image: imgUrl
        , svg: svg
      }

      var serialized = JSON.stringify(output);

      if(options.callback) {  //client made JSONP request
        res.end(options.callback + "(" + serialized + ")");
      }
      else {
        res.end(serialized);
      }
    });
  });
  this.server.listen(opts.port, opts.host);
}

module.exports = Vectogram;