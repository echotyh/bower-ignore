/**
 * Bower Ignore
 * (C) 2016 Mingdong Luo (https://github.com/mdluo) | MIT License
 */

var request = require('request');

var FORMULAE_PROTOCOL = 'https'
    FORMULAE_HOST     = 'raw.githubusercontent.com',
    FORMULAE_BASE     = '/mdluo/bower-ignore-formulae/master/formulae/',
    FORMULAE_EXT      = '.json';

function getPackageName(url) {
  return url.substring(url.lastIndexOf('/')+1, url.length-FORMULAE_EXT.length);
}

function fetchFormulae(urls, callback) {
  var next = true, count = 0, results = {};
  var handler = function(error, response, data) {
    if (next) {
      if (error || !response) {
        callback(error);
        next = false;
        return ;
      }
      var url = response.request.uri.href;
      var name = getPackageName(url);
      if (response.statusCode == 200) {
        results[name] = JSON.parse(data);
      }
      if (++count === urls.length) {
        callback(results);
      }
    }
  };
  urls.map(function (url) {
    request(url, handler);
  });
}

exports.fetchBowerIgnore = function(bowerDeps, callback) {
  if (!bowerDeps || Object.keys(bowerDeps).length == 0) {
    callback();
    return ;
  }
  var urls = [];
  for (var prop in bowerDeps) {
    if (bowerDeps.hasOwnProperty(prop)) {
      urls.push(FORMULAE_PROTOCOL + '://' + FORMULAE_HOST + FORMULAE_BASE + prop + FORMULAE_EXT);
    }
  }
  fetchFormulae(urls, function (responses) {
    callback(responses);
  });
}
