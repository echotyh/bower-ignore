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

exports.depsIgnore = DEPS_IGNORE 

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

exports.getBowerIgnore = function() {
  try {
    var bowerJSON = jsonfile.readFileSync(BOWER_JSON);
    return bowerJSON[DEPS_IGNORE];
  } catch (e) {
    return e;
  }
}

exports.setBowerIgnore = function(bowerJSON, data) {
  if (bowerJSON && data) {
    try {
      bowerJSON[DEPS_IGNORE] = data;
      jsonfile.writeFileSync(BOWER_JSON, bowerJSON);
      return true;
    } catch (e) {
      return e;
    }
  }
  return false;
}
