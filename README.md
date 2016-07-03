# Bower Ignore

[![Travis](https://img.shields.io/travis/mdluo/bower-ignore.svg?style=flat-square)](https://travis-ci.org/mdluo/bower-ignore)&nbsp;
[![Coverage](https://img.shields.io/codecov/c/github/mdluo/bower-ignore.svg?style=flat-square)](https://codecov.io/github/mdluo/bower-ignore?branch=master)&nbsp;
[![npm](https://img.shields.io/npm/v/bower-ignore.svg?style=flat-square)](https://www.npmjs.com/package/bower-ignore)&nbsp;
[![npm](https://david-dm.org/mdluo/bower-ignore.svg?style=flat-square)](https://www.npmjs.com/package/bower-ignore)&nbsp; [![npm](https://img.shields.io/npm/dt/bower-ignore.svg?style=flat-square)](https://www.npmjs.com/package/bower-ignore)&nbsp;
 [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/mdluo/bower-ignore/master/LICENSE)

A simple CLI tool to `gitignore` useless files of [bower](https://bower.io/) dependencies

## Installation

``` bash
 npm install bower-ignore -g
```

## Glossary

* **ignores**: JSON object named "dependencies-gitignore" (by default) in `bower.json`, which looks like:

```json
"dependencies-gitignore": {
  "bootstrap": {
    "ignore": ["*"],
    "unignore": ["dist/", "fonts/"]
  }
}
```

* **package**: Generally the name of a repository appeared in `bower.json`, which has been installed with bower.

* **formulae**: Collection of polular packages ignores, hosted on GitHub: [github.com/mdluo/bower-ignore-formulae](https://github.com/mdluo/bower-ignore-formulae)

> 📢**Contribution wanted!** [Go >>](https://github.com/mdluo/bower-ignore-formulae)

## Usage

**Example**

Add and set "dependencies-gitignore" (i.e. ignores, hereinbelow) based on "dependencies" in `bower.json`:

``` bash
 bdgi json
```

Add or replace (if ignores already exists) ignores based on "dependencies" packages in `bower.json`:

``` bash
 bdgi json -f
```

Download and replace ignores based on "dependencies" packages in `bower.json`:

``` bash
 bdgi json -df
```

Download `jquery` and `moment` formulae and set. Skip if packages already exist in ignores:

``` bash
 bdgi json jquery moment -d
```

Setup ignores in `bower.json` and add ignores and unignores to `.gitignore`:

``` bash
 bdgi json -d && bdgi git
```

**Command Line Usage**

``` bash
Usage: bdgi <cmd> [options] [packages...]

Commands:

  json|j [options] [packages...]  add and set "dependencies-gitignore" in bower.json
  git|g [options]                 add ignores and unignores to .gitignore based on ignores in bower.json

Options:

  -h, --help     output usage information
  -V, --version  output the version number
```

## Contributing

Feel free to submit pull requests, open issues if you have any question to ask or bug to report. Or, just help me to improve this `README.md` file and messages in `bin/bdgi` (forgive me for my poor English 😂).
