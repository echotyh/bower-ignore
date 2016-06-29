/**
 * Bower Ignore
 * (C) 2016 Mingdong Luo (https://github.com/mdluo) | MIT License
 */

var chalk = require('chalk');

var json = require('./bower-ignore/json');
var git = require('./bower-ignore/git');
var compose = require('./bower-ignore/compose');
var fetch = require('./bower-ignore/fetch');

function logError(e, debug) {
  if (e.name == 'Warning') {
    console.log(chalk.yellow('Warning!'));
  }
  else {
    console.log(chalk.red('Error!'));
  }
  if (debug) {
    console.log(chalk.grey(e.stack));
  }
  else {
    console.log(chalk.grey(e.message));
  }
}

function composeAndSet(bowerJSON, force, res) {
  var res = compose.conposeBowerIgnore(bowerJSON, force, res);
  json.setBowerJSON(res);
  console.log(chalk.green('Done.\n'));
}

exports.runJson = function(download, force, debug) {
  try {
    var bowerJSON = json.getBowerJSON();
    if (download) {
      fetch.fetchBowerIgnore(bowerJSON, function (res) {
        composeAndSet(bowerJSON, force, res);
      });
    }
    else {
      composeAndSet(bowerJSON, force);
    }
  } catch (e) {
    logError(e, debug);
  }
}

exports.runGit = function(debug) {
  try {
    var bowerJSON = json.getBowerJSON();
    var gitIgnore = compose.composeGitignore(bowerJSON);
    git.setGitignore(gitIgnore);
    console.log(chalk.green('Done.\n'));
  } catch (e) {
    logError(e, debug);
  }
}
