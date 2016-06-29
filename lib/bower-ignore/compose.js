/**
 * Bower Ignore
 * (C) 2016 Mingdong Luo (https://github.com/mdluo) | MIT License
 */

var json = require('./json');

exports.conposeBowerIgnore = function(bowerJSON, force, update) {
  if (!bowerJSON || !bowerJSON['dependencies']) {
    var e = new Error();
    e.name = 'Warning';
    e.message = json.BOWER_JSON + ': No "dependencies" found';
    throw e;
  }
  var bowerIgnore = {};
  var blank = {
    'ignore': [],
    'unignore': []
  };
  var deps = bowerJSON['dependencies'];
  var current = bowerJSON[json.DEPS_IGNORE] ? bowerJSON[json.DEPS_IGNORE] : {};
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
  bowerJSON[json.DEPS_IGNORE] = bowerIgnore;
  return bowerJSON;
}

exports.composeGitignore = function(bowerJSON) {
  var beowerIgnore = bowerJSON[json.DEPS_IGNORE];
  if (!bowerJSON || !beowerIgnore) {
    var e = new Error();
    e.name = 'Warning';
    e.message = json.BOWER_JSON + ': No "' + json.DEPS_IGNORE + '" found';
    throw e;
  }
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
