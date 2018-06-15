'use strict';


const superagent = require('superagent');


describe('Model Finder Middleware', () => { 

  it('this tests the Github Find() route, which should return the root directory and it\'s first sub-directory. The exptected responses are statusCode:200, responseType:Object', () => {
    return superagent.get('http://localhost:3000/api/v1/github')
    .then(res => {
      expect(res.status).toEqual(200);
      expect(typeof res.body).toEqual('object');
    });
  });

  it('this tests the Github FindOne() route, which should return the directory of the specified path and it\'s files and challenges. The exptected responses are statusCode:200, responseType:Object', () => {
    return superagent.get('http://localhost:3000/api/v1/github/array.map')
    .then(res => {
      expect(res.status).toEqual(200);
      expect(typeof res.body).toEqual('object');
    });
  });
}); 