/**
 * Bower Ignore
 * (C) 2016 Mingdong Luo (https://github.com/mdluo) | MIT License
 */

var chai = require("chai"),
    sinon = require("sinon"),
    sinonChai = require("sinon-chai"),
    nock = require('nock'),
    rewire = require("rewire");
var jsonfile = require("jsonfile");
var should = chai.should();
chai.use(sinonChai);

var fetch = rewire("../lib/bower-ignore/fetch");

describe('fetch', function () {

  var FORMULAE_PROTOCOL = fetch.__get__('FORMULAE_PROTOCOL'),
      FORMULAE_HOST = fetch.__get__('FORMULAE_HOST'),
      FORMULAE_BASE = fetch.__get__('FORMULAE_BASE'),
      FORMULAE_EXT = fetch.__get__('FORMULAE_EXT');
  var getPackageName = fetch.__get__('getPackageName');

  describe('#fetchBowerIgnore()', function () {

    it('return undefined when dependencies is blank', function (done) {
      fetch.fetchBowerIgnore({test1: "test1"}, function (res) {
        (!res).should.be.true;
        done();
      });
    });

    it('return error when request failed', function (done) {
      var nockResponse = nock(FORMULAE_PROTOCOL + '://' + FORMULAE_HOST)
        .get(/[^]*/)
        .times(1)
        .replyWithError('Connection lost');
      fetch.fetchBowerIgnore({dependencies: {test1: "test1"}}, function (res) {
        res.should.be.instanceof(Error);
        res.message.should.equal('Connection lost');
        done();
        nockResponse.done();
      });
    });

    var fixtrueCount = 3;
    var fixturesIn = [];
    var fixturesOut = [];
    for (var i = 1; i <= fixtrueCount; i++) {
      fixturesIn.push(jsonfile.readFileSync('./test/fixtures/fetch/0'+i+'.in.json'));
      fixturesOut.push(jsonfile.readFileSync('./test/fixtures/fetch/0'+i+'.out.json'));
    }

    fixturesIn.map(function(item, i) {
      it('should pass fixture-0' + (i+1), function (done) {
        var nockResponse = nock(FORMULAE_PROTOCOL + '://' + FORMULAE_HOST)
          .get(/[^]*/)
          .times(3)
          .reply(function (uri) {
            var name = getPackageName(uri);
            if (item.formulae[name]) {
              return [200, item.formulae[name]];
            }
            else {
              return [404, 'Not found'];
            }
          });
        fetch.fetchBowerIgnore(item.in, function (res) {
          res.should.deep.equal(fixturesOut[i]);
          done();
          nockResponse.done();
        });

      });
    });

  });

});
