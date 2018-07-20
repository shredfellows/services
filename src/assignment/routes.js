'use strict';

import express from 'express';

import Assignment from '../models/assignment.js';
import auth from '../auth/middleware.js';

const router = express.Router();

router.post('/api/v1/assignment', auth, (req, res, next) => {
  let asgn = new Assignment(req.body);
  asgn.code = req.body.code;

  asgn.save()
    .then(data => sendJSON(res, data))
    .catch(next);
});

router.put('/api/v1/assignment/note/:assignmentid', auth, (req, res, next) => {

  Assignment.findOneAndUpdate({ _id: req.params.assignmentid }, { notes: req.body.notes })
    .then(data => sendJSON(res, data))
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