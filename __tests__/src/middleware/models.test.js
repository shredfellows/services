'use strict';

jest.mock('require-dir');

import modelFinder from '../../../src/middleware/models.js';

describe('Model Finder Middleware', () => {
  it('throws an error if a valid model is not present', () => {
    let req = {};
    let res = {};
    let next = () => {};
    expect( () => {
      modelFinder(req,res,next);
    }).toThrow();
  });

  it('returns undefined model when a model does not exist', () => {
    let req = {params:{model:'john'}};
    let res = {};
    let next = () => {};
    modelFinder(req,res,next);
    expect(req.model).toBeUndefined();
   
  });

  it('returns a model object/function when a valid model is requested', () => {
    let req = {params:{model:'bar'}};
    let res = {};
    let next = () => {};
    modelFinder(req,res,next);
    expect(req.model).toBeDefined();
  });
});