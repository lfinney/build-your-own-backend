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
  let token;

  before((done) => {
    database.migrate.latest()
      .then(() => done())
      .catch((error) => {
        throw error;
      });
    chai.request(server)
      .post('/api/v1/authenticate')
      .send({ email: 'amy@turing.io', appName: 'Teacher Forum' })
      .end((error, response) => token = response.body.token)
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
          response.body.length.should.equal(1);
          response.body.includes({ 'id': 1 });
          response.body.includes({ 'tagTitle': '6.RP.A.1'});
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
    it('should retrieve a specific topicTag', (done) => {
      chai.request(server)
        .get('/api/v1/topicTags/1')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body.includes({ 'id': 1});
          response.body.includes({ 'tagTitle': '6.RP.A.1'});
          done();
      })
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

  describe('GET /api/v1/discussions/', () => {
    it('should retrieve all discussions', (done) => {
      chai.request(server)
        .get('/api/v1/discussions')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body.includes({ 'id': 1 });
          response.body.includes({ 'tagId': 1});
          response.body.includes({ 'title': 'Unit Rate'});
          response.body.includes({'body': 'Didn\'t kids get this in Grade 5?'});
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

  describe('POST /api/v1/discussions/', () => {
    it('should be able to add a new discussion', (done) => {
      chai.request(server)
        .post('/api/v1/discussions/')
        .set('Authorization', token)
        .send({
          id: 2,
          title: 'Kids these days...',
          body: 'Really like learning about Math!',
          tagId: 1
        })
        .end((error, response) => {
          response.should.have.status(201);
          response.body.should.have.property('id');
          response.body.id.should.equal(2);
          chai.request(server)
            .get('/api/v1/discussions')
            .end((error, response) => {
              response.body.should.be.a('array');
              response.body.length.should.equal(2);
              done();
            });
        });
    });

  });

  describe('GET /api/v1/discussions/:id', () => {
    it('should retrieve a specific discussion', (done) => {
      chai.request(server)
        .get('/api/v1/discussions/1')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body.includes({'id': 1});
          response.body.includes({'tagId': 1});
          response.body.includes({'title': 'Unit Rate'});
          response.body.includes({'body': 'Didn\'t kids get this in Grade 5?'});
          done();
      })
    });

    it.only('should return a 404 if path does not exist', (done) => {
      chai.request(server)
        .get('/api/v1/sadness')
        .end((error, response) => {
          response.should.have.status(404);
          done();
        });
    });

  });

  describe('PATCH /api/v1/discussions/:id', () => {
    const updateDiscussion = {
      body: 'What were their 5th grade teachers thinking?',
    };

    it('should be able to update the body of a discussion', (done) => {
      chai.request(server)
        .patch('/api/v1/discussions/1')
        .set('Authorization', token)
        .send(updateDiscussion)
        .end((error, response) => {
          response.should.have.status(204);
          chai.request(server)
            .get('/api/v1/discussions/1')
            .end((error, response) => {
              response.body.should.be.a('array');
              response.body[0].should.have.property('body');
              response.body[0].body.should.equal(updateDiscussion.body);
              done();
            });
        });
    });
  });

  describe('DELETE /api/v1/discussions/:id', () => {
    it('should delete a specific discussion', (done) => {
      chai.request(server)
        .delete('/api/v1/discussions/1')
        .set('Authorization', token)
        .end( (error, response) => {
          response.should.have.status(204);
          response.body.should.be.a('object');
          chai.request(server)
            .get('/api/v1/discussions')
            .end( (error, response) => {
              response.should.have.status(200);
              response.body.should.be.a('array');
              response.body.length.should.equal(0);
              done();
            });
        });
    });
  });

  describe('PATCH /api/v1/comments/:id', () => {
    const updateComments = {
      body: 'They weren\'t thinking.',
    };

    it('should be able to update the body of a comment', (done) => {
      chai.request(server)
        .patch('/api/v1/comments/1')
        .set('Authorization', token)
        .send(updateComments)
        .end((error, response) => {
          response.should.have.status(204);
          chai.request(server)
            .get('/api/v1/discussions/1/comments/')
            .end((error, response) => {
              response.body.should.be.a('array');
              response.body[1].should.have.property('body');
              response.body[1].body.should.equal(updateComments.body);
              done();
            });
        });
    });
  });

  describe('DELETE /api/v1/comments/:id', () => {
    it('should delete a specific comment if user has authorization', (done) => {
      chai.request(server)
        .delete('/api/v1/comments/1')
        .set('Authorization', token)
        .end( (error, response) => {
          response.should.have.status(204);
          response.body.should.be.a('object');
          chai.request(server)
            .get('/api/v1/comments/1')
            .end( (error, response) => {
              response.should.have.status(404);
              done();
            });
        });
    });

    it('should not delete a specific comment if user does not have authorization', (done) => {
      chai.request(server)
        .delete('/api/v1/comments/1')
        .end( (error, response) => {
          response.should.have.status(403);
          done();
        });
    });
  });

  describe('GET /api/v1/discussions/:id/comments', () => {
    it('should retrieve all comments for a discussion', (done) => {
      chai.request(server)
        .get('/api/v1/discussions/1/comments')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(2);
          response.body.includes({ id: 1 });
          response.body.includes({body: 'Yes but it\'s important' });
          response.body.includes({ discussionId: 1 });
          done();
      })
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

  describe('POST /api/v1/discussions/:id/comments', () => {
    it('should be able to add a comments for a discussion', (done) => {
      chai.request(server)
        .post('/api/v1/discussions/1/comments')
        .set('Authorization', token)
        .send({
          id: 3,
          body: 'Kids forget things sometimes',
          discussionId: 1
        })
        .end((error, response) => {
          response.should.have.status(201);
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(3);
          chai.request(server)
            .get('/api/v1/discussions/1/comments')
            .end((error, response) => {
              response.body.should.be.a('array');
              response.body.length.should.equal(3);
              done();
            });
        });
    });
  });

  describe('POST /api/v1/topicTags/:id/discussions', () => {
    it('should be able to add a discussion to a sepcific topc ', (done) => {
      chai.request(server)
        .post('/api/v1/topicTags/1/discussions')
        .set('Authorization', token)
        .send({
          id: 3,
          title: 'What is the air speed velocity of an unladen swallow?',
          body: 'Either African or European is fine.',
          tagId: 1
        })
        .end((error, response) => {
          response.should.have.status(201);
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(3);
          chai.request(server)
            .get('/api/v1/discussions/3/')
            .end((error, response) => {
              response.body.should.be.a('array');
              response.body.length.should.equal(1);
              response.body[0].should.have.property('id');
              response.body[0].id.should.equal(3);
              done();
            });
        });
    });
  });
});
