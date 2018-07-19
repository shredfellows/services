'use strict';

import express from 'express';

import Assignment from '../models/assignment.js';
import auth from '../auth/middleware.js';

import {runCode} from './utils.js';

const router = express.Router();

router.put('/api/v1/code/:assignmentid/:challengeName', auth, (req, res, next) => {

  let code = req.body;

  Assignment.findOneAndUpdate({
    _id: req.params.assignmentid,
  }, {
    code: code,
  })
    .then(() => runCode(code))
    .then(solution => {
      sendJSON(res, solution);
    })
    .catch(next);
});

router.post('/api/v1/code', (req, res, next) => {

  let code = req.body.code.trim();

  runCode(code)
    .then(solution => sendJSON(res, solution))
    .catch(next);
});


let sendJSON = (res, data) => {
  res.statusCode = 200;
  res.statusMessage = 'OK';
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(data));
  res.end();
};

export default router;
