'use strict';

import express from 'express';
import Assignment from '../models/assignment.js';
// import User from '../models/user.js';

const router = express.Router();


//Get a specific assignment by student ID and assignment ID
router.get('/api/v1/model/assignment/:courseid/:studentid/:assignmentid', (req, res, next) => {
  Assignment.find({})
    .then(data => sendJSON(res, data))
    .catch(next);
});

//Post the student's notes for a specfic assignment
router.post('/api/v1/model/assignment/:courseid/:studentid/:assignmentid', (req, res, next) => {
  let note = new req.model(req.body); //eslint-disable-line
  note.save()
    .then(data => sendJSON(res, data))
    .catch(next);
});

//Update the existing notes on an assignment
router.put('/api/v1/model/assignment/:courseid/:studentid/:assignmentid', (req, res, next) => {
  req.model.update(req.params.notes)
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