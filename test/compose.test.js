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

var json = require("../lib/bower-ignore/json");
var compose = require("../lib/bower-ignore/compose");

describe('compose', function () {

  describe('#conposeBowerIgnore()', function () {

    it('should return null when the first argument is null ', function () {
      var res = compose.conposeBowerIgnore();
      (!res).should.be.true;
    });

    var fixtrueCount = 4;
    var fixturesIn = [];
    var fixturesOut = [];
    for (var i = 1; i <= fixtrueCount; i++) {
      fixturesIn.push(jsonfile.readFileSync('./test/fixtures/compose/bower-ignore/0'+i+'.in'));
      fixturesOut.push(jsonfile.readFileSync('./test/fixtures/compose/bower-ignore/0'+i+'.out'));
    }

    fixturesIn.map(function(item, i) {
      it('should pass fixture-0' + (i+1), function () {
        var res = compose.conposeBowerIgnore(item.in, item.force, item.update);
        res.should.deep.equal(fixturesOut[i]);
      });
    });
  });

  describe('#composeGitignore()', function () {

    var fixtrueCount = 3;
    var fixturesIn = [];
    var fixturesOut = [];
    for (var i = 1; i <= fixtrueCount; i++) {
      fixturesIn.push(jsonfile.readFileSync('./test/fixtures/compose/gitignore/0'+i+'.in'));
      fixturesOut.push(jsonfile.readFileSync('./test/fixtures/compose/gitignore/0'+i+'.out'));
    }

    fixturesIn.map(function(item, i) {
      it('should pass fixture-0' + (i+1), function () {
        var getBowerDir = sinon.stub(json, 'getBowerDir');
        getBowerDir.returns(item.bowerDir);

        var res = compose.composeGitignore(item.in);
        getBowerDir.restore();

        res.should.deep.equal(fixturesOut[i].out);
      });
    });

  });

});
