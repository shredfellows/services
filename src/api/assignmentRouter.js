'use strict';

import express from 'express';
import Assignment from '../models/assignment.js';
// import User from '../models/user.js';

const router = express.Router();

router.post('/api/v1/assignment', (req,res,next) => {
  let asgn = new Assignment(req.body);
  asgn.save()
    .then(data => sendJSON(res,data))
    .catch(next);
});

//Post the student's notes for a specfic assignment
router.put('/api/v1/assignment/:assignmentid', (req, res, next) => {
  console.log(req.params.assignmentid);
  Assignment.findOneAndUpdate({_id:req.params.assignmentid},{notes:req.body.notes})
    .then(data => sendJSON(res, data))
    .catch(next);
});

//Post the student's code for a specfic assignment
router.put('/api/v1/assignment/code/:assignmentid', (req, res, next) => {
  console.log();
  Assignment.findOneAndUpdate({_id:req.params.assignmentid},{code :{challenge:req.body.code.challenge}})
    .then(data => sendJSON(res, data))
    .catch(next);
});

//Get a specific assignment by student ID and assignment ID
router.get('/api/v1/model/assignment/:courseid/:studentid/:assignmentid', (req, res, next) => {
  Assignment.find({})
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