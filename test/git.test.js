/**
 * Bower Ignore
 * (C) 2016 Mingdong Luo (https://github.com/mdluo) | MIT License
 */

var fs = require('fs'),
    os = require('os');
var chai = require("chai"),
    sinon = require("sinon"),
    sinonChai = require("sinon-chai"),
    rewire = require("rewire");
var should = chai.should();
chai.use(sinonChai);

var helper = require('./fixtures/git/helper');
var git = rewire("../lib/bower-ignore/git");

var existsSync, readFileSync, writeFileSync;
var GITIGNORE = git.__get__('GITIGNORE'),
    TIP = git.__get__('TIP'),
    BEGIN = git.__get__('BEGIN'),
    END = git.__get__('END');
var gitIgnore = [
  'bower_components/comp1/*',
  '!bower_components/comp1/dist',
  'bower_components/comp2/*',
  '!bower_components/comp2/dist'
];

describe('git', function() {

  describe('#setGitignore()', function() {

    describe('with blank argument', function() {

      it('should return false and no side effect with null argument', function () {
        writeFileSync = sinon.spy(fs, 'writeFileSync');
        var res = git.setGitignore();
        writeFileSync.restore();
        (!!res).should.be.false;
        writeFileSync.should.have.callCount(0);
      });
    });

    describe('with argument and `.gitignore` exists', function() {

      before(function() {
        existsSync = sinon.stub(fs, 'existsSync');
        existsSync.withArgs(GITIGNORE).returns(true);
      });

      it('should return error when readFile exception caught', function () {
        readFileSync = sinon.stub(fs, 'readFileSync');
        readFileSync.throws('ENOENT');
        (function() {
          git.setGitignore(['']);
         }).should.throw();
        readFileSync.restore();
      });

      describe('run fixtures', function() {

        var fixtures = helper.getFixutres('common', '.gitignore');
        fixtures.forEach(function(fixture, i) {
          it('should pass fixture-' + (i+1), function () {
            readFileSync = sinon.stub(fs, 'readFileSync');
            readFileSync.withArgs(GITIGNORE).returns(fixture.in);
            writeFileSync = sinon.stub(fs, 'writeFileSync');

            var res = git.setGitignore(gitIgnore);
            readFileSync.restore();
            writeFileSync.restore();

            writeFileSync.should.have.been.calledWith(GITIGNORE, fixture.out);
          });
        });

      });

      after(function () {
        existsSync.restore();
      });

    });


    describe('with argument and `.gitignore` does not exist', function() {

      before(function () {
        existsSync = sinon.stub(fs, 'existsSync');
        existsSync.withArgs(GITIGNORE).returns(false);
      });

      var fixtures = helper.getFixutres('no-gitignore', '.gitignore');
      it('should write to `.gitignore` correctly', function () {
        writeFileSync = sinon.stub(fs, 'writeFileSync');

        var res = git.setGitignore(gitIgnore);
        writeFileSync.restore();

        writeFileSync.should.have.been.calledWith(GITIGNORE, fixtures[0].out);
      });

      it('should return error when writeFile exception caught', function () {
        writeFileSync = sinon.stub(fs, 'writeFileSync');
        writeFileSync.throws('ENOENT');

        (function() {
          git.setGitignore(['']);
         }).should.throw();
        writeFileSync.restore();

      });

      after(function () {
        existsSync.restore();
      });

    });

  });
});
