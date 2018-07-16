'use strict';

jest.mock('../../../src/auth/model.js');

import auth from '../../../src/auth/middleware.js';

describe('Auth Middleware', () => {

  let errorNext = jest.fn();
  let errorObject = { message: 'Invalid User ID/Password', status: 401, statusMessage: 'Unauthorized' };

  it('throws an error if no authorization header present', () => {

    let req = { headers: {} };
    let res = {};
    auth(req, res, errorNext);
    expect(errorNext).toHaveBeenCalled();
  });

  it('returns an error when username and password are both not present', () => {
    let user = '';
    let pass = '';
    let code = btoa(`${user}:${pass}`);
    let req = { headers: { authorization: `Basic ${code}` } };
    let res = {};
    auth(req, res, errorNext);
    expect(errorNext).toHaveBeenCalledWith(errorObject);
  });

  it('returns an error when the username is not present', () => {
    let user = '';
    let pass = 'somepass';
    let code = btoa(`${user}:${pass}`);
    let req = { headers: { authorization: `Basic ${code}` } };
    let res = {};
    auth(req, res, errorNext);
    expect(errorNext).toHaveBeenCalledWith(errorObject);
  });

  it('returns an error when the password is not present', () => {
    let user = 'someuser';
    let pass = '';
    let code = btoa(`${user}:${pass}`);
    let req = { headers: { authorization: `Basic ${code}` } };
    let res = {};
    auth(req, res, errorNext);
    expect(errorNext).toHaveBeenCalledWith(errorObject);
  });

  it('passes on a token when a username and password are present', (done) => {
    let user = 'someuser';
    let pass = 'somepass';
    let code = btoa(`${user}:${pass}`);
    let req = { headers: { authorization: `Basic ${code}` } };
    let res = {};
    let next = () => {
      expect(req.token).toEqual('token!');
      done();
    };
    auth(req, res, next);
  });
});