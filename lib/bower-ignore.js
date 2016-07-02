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

function composeAndSet(bowerDeps, force, update) {
  var bowerIgnore = compose.conposeBowerIgnore(bowerDeps, force, update);
  json.setBowerIgnore(bowerIgnore);
  console.log(chalk.green('Done.\n'));
}

exports.runJson = function(download, force, debug, packages) {
  try {
    var bowerDeps = json.getBowerDeps();
    if (packages instanceof Array && packages.length) {
      packages.map(function(pac) {
        bowerDeps[pac] = '';
      });
    }
    if (download) {
      fetch.fetchBowerIgnore(bowerDeps, function (update) {
        composeAndSet(bowerDeps, force, update);
      });
    }
    else {
      composeAndSet(bowerDeps, force);
    }
  } catch (e) {
    logError(e, debug);
  }
}

exports.runGit = function(debug) {
  try {
    var bowerIgnore = json.getBowerIgnore();
    var gitIgnore = compose.composeGitignore(bowerIgnore);
    git.setGitignore(gitIgnore);
    console.log(chalk.green('Done.\n'));
  } catch (e) {
    logError(e, debug);
  }
}
