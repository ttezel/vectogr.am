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

    var svgRelPath = '../files/out.svg'
      , svgFullPath = path.resolve(__dirname, svgRelPath);

    //convert bmp to pbm to svg
    var cmd = 'mkbitmap ' + bmpDest + ' --output - | potrace -o '+ svgRelPath;

    child_process.exec(cmd, function (err, stdout, stderr) {
      if(err) throw err;

      fs.readFile(svgFullPath, cb);
    });
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