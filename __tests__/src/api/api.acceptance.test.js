'use strict';

require('babel-register');
const superagent = require('superagent');
const app = require('../../../src/app.js');

describe('API', () => {

  const PORT = 3000;
  beforeAll( () => {
    app.start(PORT);
  });
  afterAll( () => {
    app.stop();
  });

  it.only('gets a 200 response on a good model', () => {
    return superagent.get('http://localhost:3000/api/v1/bar')
      .auth('john', 'foobar')
      .then(response => {
        expect(response.statusCode).toEqual(200);
      })
      .catch(console.err);
  });

  it('gets a 500 response on an invalid model', () => {
    return superagent.get('http://localhost:3000/api/v1/foobar')
      .then(Promise.reject)
      .catch(response => {
        expect(response.status).toEqual(500);
      });
  });

});
