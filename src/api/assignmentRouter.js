'use strict';

import express from 'express';

// 'nel' module to run code
import nel from 'nel';

import Assignment from '../models/assignment.js';
// import User from '../models/user.js';
import auth from '../auth/middleware.js';
const router = express.Router();

router.post('/api/v1/assignment', auth, (req,res,next) => {
  console.log(`I'm here`);
  let asgn = new Assignment(req.body);
  console.log(asgn);
  asgn.save()
    .then(data => sendJSON(res,data))
    .catch(next);
});

//Post the student's notes for a specfic assignment
router.put('/api/v1/assignment/note/:assignmentid', auth, (req, res, next) => {
  console.log(req.params.assignmentid);
  Assignment.findOneAndUpdate({assignmentId:req.params.assignmentid},{notes:req.body.notes})
    .then(data => sendJSON(res, data))
    .catch(next);
});

//Post the student's code for a specfic assignment
router.put('/api/v1/assignment/code/:assignmentid', (req, res, next) => {
  // Route with single responsibility to test code
  
  let session = new nel.Session();
  
  const solution = {};
  
  let onStdoutArray = [];
  let onStderrArray = [];

  let code = req.body.code.challenge.trim();
  
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
      
      Assignment.findOneAndUpdate({assignmentId: req.params.assignmentid }, { code:  req.body.code } )
        .then(() => sendJSON(res, solution))
        .catch(next);
    },
  });
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