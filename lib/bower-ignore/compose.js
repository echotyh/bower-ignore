/**
 * Bower Ignore
 * (C) 2016 Mingdong Luo (https://github.com/mdluo) | MIT License
 */

var json = require('./json');

exports.composeBowerIgnore = function(bowerDeps, force, update) {
  var ignoreNew = {};
  var ignoreCurrent = json.getBowerIgnore(true);
  ignoreCurrent = ignoreCurrent ? ignoreCurrent : {};
  update = update ? update : {};
  var blank = {
    ignore: [],
    unignore: []
  };
  for (var prop in bowerDeps) {
    if (bowerDeps.hasOwnProperty(prop)) {
      var curp = ignoreCurrent[prop];
      if (!curp || Object.keys(curp).length == 0 || force) {
        ignoreNew[prop] = update[prop] ? update[prop] : blank;
      }
      else {
        ignoreNew[prop] = curp;
      }
    }
  }
  return ignoreNew;
}

exports.composeGitignore = function(bowerIgnore) {
  if (!bowerIgnore) {
    json.warning(json.BOWER_JSON + ': No "' + json.BOWER_IGNORE + '" found');
  }
  var ignoreArr = [];
  var bowerDir = json.getBowerDir();
  for (var prop in bowerIgnore) {
    if (bowerIgnore.hasOwnProperty(prop)) {
      var ignore = bowerIgnore[prop]['ignore'];
      var unignore = bowerIgnore[prop]['unignore'];
      var igLen = ignore ? ignore.length : 0;
      var unLen = unignore ? unignore.length : 0;
      var repeat = Math.max(igLen, unLen);
      for (var i = 0; i < repeat; i++) {
        if (i < igLen) {
          ignoreArr.push(bowerDir + '/' + prop + '/' + ignore[i]);
        }
        if (i < unLen) {
          ignoreArr.push('!' + bowerDir + '/' + prop + '/' + unignore[i]);
        }
      };
    }
  }
  return ignoreArr;
}
