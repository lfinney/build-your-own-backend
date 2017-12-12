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
//   it('should return the homepage with text', () => {
//     return chai.request(server)
//       .get('/')
//       .then((response) => {
//         response.should.have.status(200);
//         response.should.be.html;
//         response.res.text.includes('Palette Picker');
//       })
//       .catch((error) => {
//         throw error;
//       });
//   });
//
//   it('should return a 404 for a route that does not exist',  () => {
//     return chai.request(server)
//       .get('/whodis')
//       .then((response) => {
//         response.should.have.status(404);
//       })
//       .catch((error) => {
//         throw error;
//       });
//   });
// });
//
// describe('API Routes', () => {
//   before((done) => {
//     database.migrate.latest()
//       .then(() => done())
//       .catch((error) => {
//         throw error;
//       });
//   });
//
//   beforeEach((done) => {
//     database.seed.run()
//       .then(() => done())
//       .catch((error) => {
//         throw error;
//       });
//   });

});
