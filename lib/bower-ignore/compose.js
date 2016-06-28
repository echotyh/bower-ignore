/**
 * Bower Ignore
 * (C) 2016 Mingdong Luo (https://github.com/mdluo) | MIT License
 */

var json = require('./json');

exports.conposeBowerIgnore = function(bowerJSON, force, update) {
  if (!bowerJSON || !bowerJSON['dependencies'] ||
      Object.keys(bowerJSON['dependencies']).length == 0) {
    return ;
  }
  var bowerIgnore = {};
  var blank = {
    'ignore': [],
    'unignore': []
  };
  var deps = bowerJSON['dependencies'];
  var current = bowerJSON[json.depsIgnore] ? bowerJSON[json.depsIgnore] : {};
  update = update ? update : {};
  for (var prop in deps) {
    if (deps.hasOwnProperty(prop)) {
      var curp = current[prop];
      if (!curp || Object.keys(curp).length == 0 || force) {
        bowerIgnore[prop] = update[prop] ? update[prop] : blank;
      }
      else {
        bowerIgnore[prop] = curp;
      }
    }
  }
  return bowerIgnore;
}

exports.composeGitignore = function(beowerIgnore) {
  var ignoreArr = [];
  var bowerDir = json.getBowerDir();
  for (var prop in beowerIgnore) {
    if (beowerIgnore.hasOwnProperty(prop)) {
      if (beowerIgnore[prop]['ignore']) {
        beowerIgnore[prop]['ignore'].map(function (item) {
          ignoreArr.push(bowerDir + '/' + prop + '/' + item);
        });
      }
      if (beowerIgnore[prop]['unignore']) {
        beowerIgnore[prop]['unignore'].map(function (item) {
          ignoreArr.push('!' + bowerDir + '/' + prop + '/' + item);
        });
      }
    }
  }
  return ignoreArr;
}
