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

var helper = require('./fixtures/helper');
var fetch = rewire("../lib/bower-ignore/fetch");

var FORMULAE_PROTOCOL = fetch.__get__('FORMULAE_PROTOCOL'),
    FORMULAE_HOST = fetch.__get__('FORMULAE_HOST'),
    FORMULAE_BASE = fetch.__get__('FORMULAE_BASE'),
    FORMULAE_EXT = fetch.__get__('FORMULAE_EXT');
var getPackageName = fetch.__get__('getPackageName');

describe('fetch', function () {


  describe('#fetchBowerIgnore()', function () {

    it('return undefined when dependencies is blank', function (done) {
      fetch.fetchBowerIgnore({}, function (res) {
        (!!res).should.be.false;
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

    var fixtures = helper.getFixutres('fetch', '.json');
    fixtures.forEach(function(fixture, i) {
      it('should pass fixture-' + (i+1), function (done) {
        var nockResponse = nock(FORMULAE_PROTOCOL + '://' + FORMULAE_HOST)
          .get(/[^]*/)
          .times(Object.keys(fixture.in).length)
          .reply(function (uri) {
            var name = getPackageName(uri);
            var package = fixture.args.formulae[name];
            if (package) {
              return [200, package];
            }
            else {
              return [404, 'Not found'];
            }
          });
        fetch.fetchBowerIgnore(fixture.in, function (res) {
          res.should.deep.equal(fixture.out);
          done();
          nockResponse.done();
        });

      });
    });

  });

});
