/**
 * Bower Ignore
 * (C) 2016 Mingdong Luo (https://github.com/mdluo) | MIT License
 */

var chai = require("chai"),
    sinon = require("sinon"),
    sinonChai = require("sinon-chai");
var should = chai.should();
chai.use(sinonChai);

var jsonfile = require('jsonfile');

var helper = require('./fixtures/helper');
var json = require("../lib/bower-ignore/json");
var compose = require("../lib/bower-ignore/compose");

describe('compose', function () {

  describe('#composeBowerIgnore()', function () {

    var readFileSync;

    beforeEach(function() {
      readFileSync = sinon.stub(jsonfile, 'readFileSync');
    });

    afterEach(function() {
      readFileSync.restore();
    });

    it('should return blank object when the first argument is null', function () {
      readFileSync.withArgs(json.BOWER_JSON).returns({});
      var res = compose.composeBowerIgnore();
      res.should.deep.equal({});
    });

    var fixtures = helper.getFixutres('compose/json', '.json');
    fixtures.forEach(function (fixture, i) {
      it('should pass fixture-' + (i+1), function () {
        readFileSync.withArgs(json.BOWER_JSON).returns(fixture.in);

        var res = compose.composeBowerIgnore(fixture.in.dependencies,
                  fixture.args.force, fixture.args.update);

        readFileSync.restore();
        res.should.deep.equal(fixture.out);
      });
    });
  });

  describe('#composeGitignore()', function () {

    it('should throw error when there is no "dependencies-gitignore"', function () {
      (function() {
        compose.composeGitignore();
       }).should.throw();
    });

    var fixtures = helper.getFixutres('compose/git', '.json');
    fixtures.forEach(function (fixture, i) {
      it('should pass fixture-' + (i+1), function () {
        var getBowerDir = sinon.stub(json, 'getBowerDir');
        getBowerDir.returns(fixture.args.bowerDir);

        var res = compose.composeGitignore(fixture.in);

        getBowerDir.restore();
        res.should.deep.equal(fixture.out);
      });
    });

  });

});
