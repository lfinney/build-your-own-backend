/* eslint-disable */

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

const should = chai.should();

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return an html homepage with text', (done) => {
  chai.request(server)
    .get('/')
    .end((error, response) => {
      response.should.have.status(200);
      response.should.be.html;
      response.res.text.includes('Teacher Forum');
      done();
    });
});

  it('should return a 404 for a route that does not exist', (done) => {
    chai.request(server)
      .get('/sadness')
      .end((err, response) => {
        response.should.have.status(404);
        done();
      });
  });

});

describe('API Routes', () => {
  before((done) => {
    database.migrate.latest()
      .then(() => done())
      .catch((error) => {
        throw error;
      });
  });

  beforeEach((done) => {
    database.seed.run()
      .then(() => done())
      .catch((error) => {
        throw error;
      });
  });

  describe('GET /api/v1/topicTags', () => {
    it('should revtrieve all discussion topic tags', (done) => {
      chai.request(server)
        .get('/api/v1/topicTags')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(2);
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(1);
          response.body[0].should.have.property('tagTitle');
          response.body[0].tagTitle.should.equal('6.RP.A.1');
          response.body[1].should.have.property('id');
          response.body[1].id.should.equal(2);
          response.body[1].should.have.property('tagTitle');
          response.body[1].tagTitle.should.equal('6.RP.A.2');
          done();
        });
    });


    it('should return a 404 if path does not exist', (done) => {
      chai.request(server)
        .get('/api/v1/sadness')
        .end((error, response) => {
          response.should.have.status(404);
          done();
        });
    });
  });

  describe('GET /api/v1/topicTags/:id', () => {

  });

  describe('GET /api/v1/discussions/', () => {

  });

  describe('POST /api/v1/discussions/', () => {

  });

  describe('GET /api/v1/discussions/:id', () => {

  });

  describe('PATCH /api/v1/discussions/:id', () => {

  });

  describe('DELETE /api/v1/discussions/:id', () => {

  });

  describe('PATCH /api/v1/comments/:id', () => {

  });

  describe('DELETE /api/v1/comments/:id', () => {

  });

  describe('GET /api/v1/discussions/:id/comments', () => {

  });

  describe('POST /api/v1/discussions/:id/comments', () => {

  });

  describe('POST /api/v1/topicTags/:id/comments', () => {

  });
});
