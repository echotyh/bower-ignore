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
    DEPS_IGNORE = 'dependencies-gitignore';

exports.BOWER_JSON = BOWER_JSON;
exports.DEPS_IGNORE = DEPS_IGNORE;

exports.warning = function(message) {
  var e = new Error();
  e.name = 'Warning';
  e.message = message;
  throw e;
}

exports.getBowerDir = function() {
  var bowerDir = BOWER_COMPONENTS;
  if (fs.existsSync(BOWER_RC)) {
    var bowerRC = jsonfile.readFileSync(BOWER_RC);
    if (bowerRC.directory) {
      bowerDir = bowerRC.directory;
    }
  }
  return bowerDir;
}

exports.getBowerJSON = function() {
  var bowerJSON = jsonfile.readFileSync(BOWER_JSON);
  if (!bowerJSON || !bowerJSON['dependencies']) {
    warning(json.BOWER_JSON + ': No "dependencies" found');
  }
  return bowerJSON;
}

exports.setBowerJSON = function(bowerJSON) {
  if (bowerJSON) {
    jsonfile.writeFileSync(BOWER_JSON, bowerJSON);
    return true;
  }
  return false;
}
