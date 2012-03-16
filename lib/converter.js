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

var rComments = /([\s\S]+%%EndComments\n%%)/g;  //regex to strip comments from .svg file

var reserved = [];

var Converter = function () {};

module.exports = Converter;

//
//  Grab image from imgUrl, call cb with svg output
//
Converter.prototype.svg = function (imgUrl, options, cb) {
  var makeName = this.fName(imgUrl)
    , bmpAbsPath =  makeName.fPath
    , bmpRelPath = path.relative(process.cwd(), bmpAbsPath);

  var opts = {
      src: imgUrl
    , dst: bmpRelPath
  };

  //convert to bmp
  easyimg.convert(opts, function (err, stdout, stderr) {
    if(err) return cb(err, null);

    var potraceCmd = 'potrace -o -';
    
    if(options.pathonly === 'true') potraceCmd += ' --flat';

    var cmd =  'mkbitmap ' + bmpRelPath + ' -o - | ' + potraceCmd;

    //convert bmp to pbm to svg
    var cp = child_process.exec(cmd, function (err, stdout, stderr) {
      if(err) return cb(err, null);

      if(options.pathonly === 'true') { //only send over the path info
        stdout = stdout.replace(rComments, ''); 
      }

      fs.unlink(bmpAbsPath, function (err) {
        if(err) throw err;
        
        var index = reserved.indexOf(bmpAbsPath);
        if(index !== -1) {
          reserved.splice(index, 1);  //remove from reserved filenames
        }
        return cb(null, stdout);
      });
    });
  })
}

//
//  generate unique filename in files/ for this request
//  reserve filename until file is written
//
//  return absolute file path & hash used as 
//  filename (excluding file extension)
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

    exists = path.existsSync(fPath) || reserved.indexOf(fPath) !== -1;
    count++;
  }
  reserved.push(fPath);

  return { fPath: fPath, hash: hash };
}