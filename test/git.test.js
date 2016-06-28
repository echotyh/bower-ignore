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

var git = rewire("../lib/bower-ignore/git");

describe('git', function() {

  var existsSync, readFileSync, writeFileSync;
  var GITIGNORE = git.__get__('GITIGNORE'),
      TIP = git.__get__('TIP'),
      BEGIN = git.__get__('BEGIN'),
      END = git.__get__('END');
  var composedArr = [
    'bower_components/comp1/*',
    '!bower_components/comp1/dist',
    'bower_components/comp2/*',
    '!bower_components/comp2/dist'
  ];

  describe('#setGitignore()', function() {

    describe('with blank argument', function() {

      it('should return false and no side effect with null argument', function () {
        writeFileSync = sinon.spy(fs, 'writeFileSync');
        var res = git.setGitignore();
        writeFileSync.restore();
        res.should.be.false;
        writeFileSync.should.have.callCount(0);
      });
    });

    describe('with argument and `.gitignore` exists', function() {

      before(function() {
        existsSync = sinon.stub(fs, 'existsSync');
        existsSync.withArgs(GITIGNORE).returns(true);
      });

      it('should return error when readFile exception catched', function () {
        readFileSync = sinon.stub(fs, 'readFileSync');
        readFileSync.throws('ENOENT');
        var res = git.setGitignore(['']);
        readFileSync.restore();
        res.should.be.instanceof(Error);
        res.toString().should.equal('ENOENT');
      });

      describe('run fixtures', function() {

        var fixtrueCount = 5;
        var fixturesIn = [];
        var fixturesOut = [];
        for (var i = 1; i <= fixtrueCount; i++) {
          fixturesIn.push(fs.readFileSync('./test/fixtures/git/0'+i+'.in'));
          fixturesOut.push(fs.readFileSync('./test/fixtures/git/0'+i+'.out').toString());
        }

        fixturesIn.map(function(item, i) {
          it('should pass fixture-0' + (i+1), function () {
            readFileSync = sinon.stub(fs, 'readFileSync');
            readFileSync.withArgs(GITIGNORE).returns(fixturesIn[i]);
            writeFileSync = sinon.stub(fs, 'writeFileSync');
            writeFileSync.returns();

            var res = git.setGitignore(composedArr);
            readFileSync.restore();
            writeFileSync.restore();

            res.should.be.true;
            writeFileSync.should.have.been.calledWith(GITIGNORE, fixturesOut[i]);
          });
        });

      });

      after(function () {
        existsSync.restore();
      });

    });

    describe('with argument and `.gitignore` does not exist', function() {

      var fixtureOut = fs.readFileSync('./test/fixtures/git/no_gitignore.out').toString()

      before(function () {
        existsSync = sinon.stub(fs, 'existsSync');
        existsSync.withArgs(GITIGNORE).returns(false);
      });


      it('should write to `.gitignore` correctly', function () {
        writeFileSync = sinon.stub(fs, 'writeFileSync');
        writeFileSync.returns();

        var res = git.setGitignore(composedArr);
        writeFileSync.restore();

        res.should.be.true;
        writeFileSync.should.have.been.calledWith(GITIGNORE, fixtureOut);
      });

      it('should return error when writeFile exception catched', function () {
        writeFileSync = sinon.stub(fs, 'writeFileSync');
        writeFileSync.throws('ENOENT');

        var res = git.setGitignore(composedArr);
        writeFileSync.restore();

        res.should.be.instanceof(Error);
        res.toString().should.equal('ENOENT');
      });

      after(function () {
        existsSync.restore();
      });

    });

  });
});
