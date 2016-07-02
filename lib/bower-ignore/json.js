/**
 * Bower Ignore
 * (C) 2016 Mingdong Luo (https://github.com/mdluo) | MIT License
 */

var fs = require('fs');
var jsonfile = require('jsonfile');

jsonfile.spaces = 2;

var BOWER_JSON = 'bower.json',
    BOWER_RC = '.bowerrc',
    BOWER_COMPONENTS = 'bower_components',
    BOWER_IGNORE = 'dependencies-gitignore';

exports.BOWER_JSON = BOWER_JSON;
exports.BOWER_IGNORE = BOWER_IGNORE;

var warning = function(message) {
  var e = new Error();
  e.name = 'Warning';
  e.message = message;
  throw e;
};
exports.warning = warning;

exports.getBowerDir = function() {
  var bowerDir = BOWER_COMPONENTS;
  if (fs.existsSync(BOWER_RC)) {
    try {
      var bowerRC = jsonfile.readFileSync(BOWER_RC);
    } catch (e) {
      return bowerDir;
    }
    if (bowerRC.directory) {
      bowerDir = bowerRC.directory;
    }
  }
  return bowerDir;
};

exports.getBowerDeps = function() {
  var bowerJSON = jsonfile.readFileSync(BOWER_JSON);
  if (!bowerJSON || !bowerJSON['dependencies']) {
    warning(BOWER_JSON + ': No "dependencies" found');
  }
  return bowerJSON['dependencies'];
};

exports.getBowerIgnore = function(skip) {
  var bowerJSON = jsonfile.readFileSync(BOWER_JSON);
  if (!bowerJSON || !bowerJSON[BOWER_IGNORE]) {
    if (skip) {
      return ;
    }
    warning(BOWER_JSON + ': No "' + BOWER_IGNORE + '" found');
  }
  return bowerJSON[BOWER_IGNORE];
};

exports.setBowerIgnore = function(bowerIgnore) {
  var bowerJSON = jsonfile.readFileSync(BOWER_JSON);
  bowerJSON[BOWER_IGNORE] = bowerIgnore;
  jsonfile.writeFileSync(BOWER_JSON, bowerJSON);
};
