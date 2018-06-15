'use strict';

import express from 'express';

// 'nel' module to run code
import nel from 'nel';

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

//Post the student's notes for a specfic assignment
router.put('/api/v1/assignment/note/:assignmentid', auth, (req, res, next) => {

  Assignment.findOneAndUpdate({ _id: req.params.assignmentid }, { notes: req.body.notes })
    .then(data => sendJSON(res, data))
    .catch(next);
});

//Post the student's code for a specfic assignment
router.put('/api/v1/assignment/code/:assignmentid/:challengeName', auth, (req, res, next) => {
  
  let session = new nel.Session();

  const solution = {};

  let onStdoutArray = [];
  let onStderrArray = [];

  let challenge = req.params.challengeName;

  let code = req.body.code[challenge].trim();

  solution.input = code;

  session.execute(code, {
    onSuccess: (output) => {
      solution.return = output.mime['text/plain'];
    },
    onError: (output) => {
      solution.error = output.error;
    },
    onStdout: (output) => {
      onStdoutArray.push(output);
      solution['console.log'] = onStdoutArray;
    },
    onStderr: (output) => {
      onStderrArray.push(output);
      solution['console.error'] = onStderrArray;
    },
    afterRun: () => {

      Assignment.findOneAndUpdate({
        _id: req.params.assignmentid,
      }, {
        code: req.body.code,
      })
        .then(() => sendJSON(res, solution))
        .catch(next);
    },
  });
});

router.post('/api/v1/code', (req, res) => {

  let session = new nel.Session();

  const solution = {};

  let onStdoutArray = [];
  let onStderrArray = [];

  let code = req.body.code;

  solution.input = code;

  session.execute(code, {
    onSuccess: (output) => {
      solution.return = output.mime['text/plain'];
    },
    onError: (output) => {
      solution.error = output.error;
    },
    onStdout: (output) => {
      onStdoutArray.push(output);
      solution['console.log'] = onStdoutArray;
    },
    onStderr: (output) => {
      onStderrArray.push(output);
      solution['console.error'] = onStderrArray;
    },
    afterRun: () => {
      sendJSON(res, solution);
    },
  });
});


//Get a specific assignment by student ID and assignment ID
router.get('/api/v1/model/assignment/:assignmentid', auth, (req, res, next) => {

  Assignment.find({_id: req.params.assignmentid})
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