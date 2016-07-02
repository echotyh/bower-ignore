/**
 * Bower Ignore
 * (C) 2016 Mingdong Luo (https://github.com/mdluo) | MIT License
 */

var fs = require('fs');
var chai = require("chai"),
    sinon = require("sinon"),
    sinonChai = require("sinon-chai"),
    rewire = require("rewire");
var jsonfile = require("jsonfile");
var should = chai.should();
chai.use(sinonChai);

var json = rewire("../lib/bower-ignore/json");

var existsSync, readFileSync, writeFileSync;
var BOWER_RC = json.__get__('BOWER_RC'),
    BOWER_COMPONENTS = json.__get__('BOWER_COMPONENTS'),
    BOWER_JSON = json.__get__('BOWER_JSON'),
    BOWER_IGNORE = json.__get__('BOWER_IGNORE');

describe('json', function() {

  beforeEach(function() {
    existsSync = sinon.stub(fs, 'existsSync');
    readFileSync = sinon.stub(jsonfile, 'readFileSync');
    writeFileSync = sinon.stub(jsonfile, 'writeFileSync');
  });

  afterEach(function() {
    existsSync.restore();
    readFileSync.restore();
    writeFileSync.restore();
  });

  describe('#getBowerDir()', function() {

    describe('when there is no `.bowerrc`', function() {

      it('should return "bower_components"', function () {
        existsSync.withArgs(BOWER_RC).returns(false);
        var bowerDir = json.getBowerDir();
        existsSync.restore();
        bowerDir.should.equal(BOWER_COMPONENTS);
      });

    });

    describe('when there is `.bowerrc`', function () {

      beforeEach(function() {
        existsSync.withArgs(BOWER_RC).returns(true);
      });

      it('should return "bower_components" when exception caught during readFileSync', function () {
        readFileSync.withArgs(BOWER_RC).throws('ENOENT');
        var bowerDir = json.getBowerDir();
        bowerDir.should.equal(BOWER_COMPONENTS);
      });

      it('should return "bower_components" when no "directory" configured', function () {
        readFileSync.withArgs(BOWER_RC).returns({});
        var bowerDir = json.getBowerDir();
        bowerDir.should.equal(BOWER_COMPONENTS);
      });

      it('should return value of "directory" when configured', function () {
        readFileSync.withArgs(BOWER_RC).returns({directory: 'test_dir'});
        var bowerDir = json.getBowerDir();
        bowerDir.should.equal('test_dir');
      });

    });
  });

  describe('#getBowerDeps()', function() {

    it('should return error when exception caught during readFileSync', function () {
      readFileSync.withArgs(BOWER_JSON).throws('ENOENT');
      (function() {
        json.getBowerDeps();
       }).should.throw();
    });

    it('should return warning when no "dependencies" configured', function () {
      readFileSync.withArgs(BOWER_JSON).returns({});
      (function() {
        json.getBowerDeps();
       }).should.throw();
    });

    it('should return object when `bower.json` was correctly configured', function () {
      var bowerJSON = {dependencies: {test: 'testVal'}};
      readFileSync.withArgs(BOWER_JSON).returns(bowerJSON);
      var bowerDeps = json.getBowerDeps();
      bowerDeps.should.be.a('object');
      bowerDeps.should.deep.equal(bowerJSON.dependencies);
    });

  });

  describe('#getBowerIgnore()', function() {

    it('should return error when exception caught during readFileSync', function () {
      readFileSync.withArgs(BOWER_JSON).throws('ENOENT');
      (function() {
        json.getBowerIgnore();
       }).should.throw();
    });

    it('should return warning when no "dependencies-gitignore" configured', function () {
      readFileSync.withArgs(BOWER_JSON).returns({});
      (function() {
        json.getBowerIgnore();
       }).should.throw();
    });

    it('should return object when `bower.json` was correctly configured', function () {
      var bowerJSON = {'dependencies-gitignore': {test: 'testVal'}};
      readFileSync.withArgs(BOWER_JSON).returns(bowerJSON);
      var bowerIgnore = json.getBowerIgnore();
      bowerIgnore.should.be.a('object');
      bowerIgnore.should.deep.equal(bowerJSON['dependencies-gitignore']);
    });

  });

  describe('#setBowerIgnore()', function() {

    it('should return error when exception caught during readFileSync', function () {
      readFileSync.withArgs(BOWER_JSON).throws('ENOENT');
      (function() {
        json.setBowerIgnore({});
       }).should.throw();
    });

    it('should return error when exception caught during writeFileSync', function () {
      writeFileSync.throws('ENOENT');
      (function() {
        json.setBowerIgnore({});
       }).should.throw();
    });

    it('should return object when `bower.json` was correctly configured', function () {
      var bowerIgnore = {test: 'val'};
      var bowerJSON = {dependencies: {}};
      readFileSync.withArgs(BOWER_JSON).returns(bowerJSON);
      json.setBowerIgnore(bowerIgnore);
      writeFileSync.should.have.been.calledWith(BOWER_JSON, {
        dependencies: {},
        'dependencies-gitignore': { test: "val" }
      });
    });

  });

});
