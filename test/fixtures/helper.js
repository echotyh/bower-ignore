/**
 * Bower Ignore
 * (C) 2016 Mingdong Luo (https://github.com/mdluo) | MIT License
 */

var fs = require('fs');
var path = require('path')
var jsonfile = require('jsonfile');

exports.getFixutres = function (dir, ext) {
  var fixtures = [];
  dir = path.join(__dirname, dir);
  var files = fs.readdirSync(dir);
  files.map(function (file) {
    return path.join(dir, file);
  })
  .filter(function (file) {
    return (fs.statSync(file).isFile() && path.extname(file) == ext);
  })
  .forEach(function (file) {
    var fixture = jsonfile.readFileSync(file);
    fixtures.push(fixture);
  });
  return fixtures;
}
