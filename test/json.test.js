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

describe('json', function() {

  var existsSync, readFileSync, writeFileSync,
      BOWER_RC = json.__get__('BOWER_RC'),
      BOWER_COMPONENTS = json.__get__('BOWER_COMPONENTS'),
      BOWER_JSON = json.__get__('BOWER_JSON'),
      DEPS_IGNORE = json.__get__('DEPS_IGNORE');

  describe('#getBowerDir()', function() {

    describe('when there is no `.bowerrc`', function() {

      beforeEach(function() {
        existsSync = sinon.stub(fs, 'existsSync');
        existsSync.withArgs(BOWER_RC).returns(false);
      });

      it('should return "bower_components"', function () {
        var bowerDir = json.getBowerDir();
        bowerDir.should.equal(BOWER_COMPONENTS);
      });

      afterEach(function() {
        existsSync.restore();
      });
    });

    describe('when there is `.bowerrc`', function () {

      beforeEach(function() {
        existsSync = sinon.stub(fs, 'existsSync');
        readFileSync = sinon.stub(jsonfile, 'readFileSync');
        existsSync.withArgs(BOWER_RC).returns(true);
      });

      it('should return "bower_components" when exception catched', function () {
        readFileSync.withArgs(BOWER_RC).throws('ENOENT');
        (function() {
          json.getBowerDir();
         }).should.throw();
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

      afterEach(function() {
        existsSync.restore();
        readFileSync.restore();
      });
    });
  });

  describe('#getBowerJSON()', function() {

    beforeEach(function() {
      readFileSync = sinon.stub(jsonfile, 'readFileSync');
    });

    it('should return error when exception catched', function () {
      readFileSync.withArgs(BOWER_JSON).throws('ENOENT');
      (function() {
        json.getBowerJSON();
       }).should.throw();
    });

    it('should return object when `bower.json` was correctly configured', function () {
      var bowerJSON = {dependencies: {test: 'testVal'}};
      readFileSync.withArgs(BOWER_JSON).returns(bowerJSON);
      var res = json.getBowerJSON();
      res.should.be.a('object');
      res.should.deep.equal(bowerJSON);
    });

    afterEach(function() {
      readFileSync.restore();
    });
  });

  describe('#setBowerJSON()', function() {

    beforeEach(function() {
      writeFileSync = sinon.stub(jsonfile, 'writeFileSync');
    });

    it('should return null without parameters', function () {
      var res = json.setBowerJSON();
      res.should.equal(false);
    });

    it('should return error when exception catched', function () {
      writeFileSync.throws('ENOENT');
      (function() {
        json.setBowerJSON(BOWER_JSON, {});
       }).should.throw();
    });

    it('should return object when `bower.json` was correctly configured', function () {
      var bowerJSON = {test: 'testVal'};
      writeFileSync.withArgs(BOWER_JSON, bowerJSON).returns();
      var res = json.setBowerJSON(BOWER_JSON, bowerJSON);
      res.should.equal(true);
    });

    afterEach(function() {
      writeFileSync.restore();
    });
  });

  describe('description', function() {

  });

});
