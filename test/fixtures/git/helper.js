/**
 * Bower Ignore
 * (C) 2016 Mingdong Luo (https://github.com/mdluo) | MIT License
 */

var fs = require('fs');
var path = require('path')

exports.getFixutres = function (dir, ext) {
  var fixturesMap = {};
  var fixturesArr = [];
  var i = 0;
  dir = path.join(__dirname, dir);
  var files = fs.readdirSync(dir);
  files.filter(function (file) {
    var fullPath = path.join(dir, file);
    return (fs.statSync(fullPath).isFile() && path.extname(fullPath) == ext);
  })
  .forEach(function (file) {
    var fixture = fs.readFileSync(path.join(dir, file)).toString();
    var fileName = file.split('.');
    if (!fixturesMap[fileName[0]]) {
      fixturesMap[fileName[0]] = {};
    }
    fixturesMap[fileName[0]][fileName[fileName.length-2]] = fixture;
  });
  for (var prop in fixturesMap) {
    if (fixturesMap.hasOwnProperty(prop)) {
      fixturesArr.push(fixturesMap[prop]);
    }
  }
  return fixturesArr;
}
