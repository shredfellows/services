'use strict';

let assignment = require('../../../src/models/assignment.js');
// let express.router = require('../../././src/api/api.js');
let superagent = require('superagent');

describe('api', () => {

  it('registers routes of multiple types', () => {

    return superagent.get('http://localhost:3000/api/v1/model/assignment/:courseid/:studentid/:assignmentid') 
      .then(res => {
        expect(res).toBe(false);
      });

  });

  // it('can create multiple routes of the same type', () => {
  //   superagent.routes.GET = {};
  //   superagent.get('/a', () => true);
  //   superagent.get('/b', () => true);
  //   superagent.get('/c', () => true);
  //   expect( Object.keys(superagent.routes.GET).length ).toEqual(3);
  // });

  // it('can route get requests', () => {
  //   let expected = 'get/test';
  //   superagent.get('/test', () => expected);
  //   let req = { method: 'GET', url: 'http://localhost/test?john=bald' };
  //   let res = {};
  //   return superagent.router.route(req,res)
  //     .then( result => expect(result).toEqual(expected));
  // });
});

