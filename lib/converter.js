//
//  Converter
//
//  takes incoming image url's and converts them to svg
//
var child_process = require('child_process')
  , crypto = require('crypto')
  , fs = require('fs')
  , path = require('path')
  , easyimg = require('easyimage');

var Converter = function () {};

module.exports = Converter;

//
//  Grab image from imgUrl, call cb with svg output
//
Converter.prototype.svg = function (imgUrl, options, cb) {
  var self = this;

  var makeName = this.fName(imgUrl)
    , bmpAbsPath =  makeName.fPath
    , bmpRelPath = path.relative(__dirname, bmpAbsPath);

  var opts = {
      src: imgUrl
    , dst: bmpRelPath
  };

  console.log('run easyimage')

  //convert to bmp
  easyimg.convert(opts, function (err, stdout, stderr) {
    console.log('done easyimage conversion')

    if(err) return cb(err, null);

    var potraceCmd = 'potrace -o -';
    
    if(options.pathonly === 'true') potraceCmd += ' --flat';

    var cmd =  'mkbitmap ' + bmpRelPath + ' -o - | ' + potraceCmd;

    console.log('execing: ', cmd)

    //convert bmp to pbm to svg
    var cp = child_process.exec(cmd, function (err, stdout, stderr) {
      if(err) return cb(err, null);

      
      /*
      var output = stdout
        , rComments = /(.+%%EndComments\\n%%)/;  //regex to strip comments from .svg file

      stdout = stdout.replace(rComments, '');
      */

      fs.unlink(bmpAbsPath, function (err) {
        if(err) throw err;
        return cb(null, stdout);
      });
    });
  })
}

//
//  generate unique filename in files/ for this request
//
//  return file path & hash used as filename (excluding the file extension)
//
Converter.prototype.fName = function (imgUrl) {
  var exists = true
    , sha
    , hash = ''
    , fName = ''
    , fPath = ''
    , count = 0;

  while(exists) {
    sha = crypto.createHash('sha1');
    sha.update(imgUrl + count);
    
    hash = sha.digest('hex');
    fName = hash + '.bmp';
    fPath = path.resolve(__dirname, '../files/', fName)

    exists = path.existsSync(fPath);
    count++;
  }

  return { fPath: fPath, hash: hash };
}