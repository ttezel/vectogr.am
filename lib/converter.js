var child_process = require('child_process')
  , crypto = require('crypto')
  , fs = require('fs')
  , path = require('path')
  , easyimg = require('easyimage');

var Converter = function () {
  
};

module.exports = Converter;

Converter.prototype.svg = function (params, cb) {
  var self = this
    , apiKey = params.apiKey
    , authHash = params.authHash
    , imgUrl = params.imgUrl;

  var makeName = this.fName(apiKey, authHash, imgUrl)
    , bmpDest = makeName.relpath
    , hash = makeName.hash;

  var opts = {
      src: imgUrl
    , dst: bmpDest
  };

  //convert to bmp
  easyimg.convert(opts, function (err, stdout, stderr) {
    if(err) throw err;

    var svgRelPath = '../files/' + hash + '.svg'
      , svgFullPath = path.resolve(__dirname, svgRelPath);

    //convert bmp to pbm to svg
    var cmd = 'mkbitmap ' + bmpDest + ' --output - | potrace --output -'
      , out = '';

    var cp = child_process.exec(cmd, function (err, stdout, stderr) {
      if(err) throw err;

      out += stdout;
    });

    cp.on('exit', function (code, signal) {
      console.log('exit code', code)

      if(code !== 0) {
        var err = new Error('child process exited with errors');
        return cb(err, null);
      }
      fs.unlink(bmpDest, function (err) {
        if(err) throw err;
      });
      return cb(null, out);
    })
  })
}

//
//  generate unique filename in files/ from apiKey, authHash, imgUrl
//  return relative filename (for easyimage usage)
//
Converter.prototype.fName = function (apiKey, authHash, imgUrl) {
  var sha = crypto.createHash('sha1');
  sha.update(apiKey + authHash + imgUrl);
  var hashed = sha.digest('hex')
    , name = '../files/' + hashed + '.bmp';

  return { relpath: name, hash: hashed };
}