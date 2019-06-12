var app = require('../../server');
var chai = require('chai');
var request = require('supertest');

var expect = chai.expect;

describe('API Tests', function() {
  describe('Bad path tests', function() {
    it('should return invalid argument error when amount is negative', function(done) {
      request(app)
        .get('/api/v1/withdrawal/-310')
        .end(function(err, res) {
          expect(res.body.status).to.equal('error');
          expect(res.body.message).to.equal('Invalid Argument');
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should return note unavailable error when given amount cannot be withdrawn', function(done) {
      request(app)
        .get('/api/v1/withdrawal/125')
        .end(function(err, res) {
          expect(res.body.status).to.equal('error');
          expect(res.body.message).to.equal('Note unavailable');
          expect(res.statusCode).to.equal(500);
          done();
        });
    });
  });

  describe('Happy path tests', function() {
    it('should return empty array when there is no amount specifed', function(done) {
      request(app)
        .get('/api/v1/withdrawal/')
        .end(function(err, res) {
          expect(res.body).to.eql([]);
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should return 20,10 when specifed amount is 30', function(done) {
      request(app)
        .get('/api/v1/withdrawal/30')
        .end(function(err, res) {
          expect(res.body).to.eql([20, 10]);
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should return 50,20,10 when specifed amount is 80', function(done) {
      request(app)
        .get('/api/v1/withdrawal/80')
        .end(function(err, res) {
          expect(res.body).to.eql([50, 20, 10]);
          expect(res.statusCode).to.equal(200);
          done();
        });
    });
  });
});
