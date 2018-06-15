'use strict';

import notFound from '../../../src/middleware/404.js';
import modelfinder from '../../../src/middleware/models.js';
jest.mock('require-dir');

describe('run 404 middleware', () => {
  it ('404 error triggers when model not executed properly', () => {
    let req={params:{model:'foo'}};
    let res={};
    let next = () => {
      notFound(req, res, next);
    }; 
    modelfinder(req, res, next);
    expect(() => {
      req.model.save()
        .then(console.log)
        .catch(next);
    }).statusCodetoBe(404);
  });
});