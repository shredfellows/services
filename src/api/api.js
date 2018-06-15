'use strict';

import express from 'express';
const router = express.Router();
import auth from '../auth/middleware.js';

// 'nel' module to run code
import nel from 'nel';

// Dynamic Models
// This will use a model matching /:model/ in all routes that have a model parameter
import modelFinder from '../middleware/models.js';
router.param('model', modelFinder);

// Each of our REST endpoints simply calls the model's appropriate CRUD Method (only give the students GET and POST for now)
// In all cases, we just catch(next), which feeds any errors we get into the next() as a param
// This fires off the error middleware automatically.  Otherwise, we send out a formatted JSON Response

router.get('/api/v1/:model', auth, (req,res,next) => {
  req.model.find({})
    .then( data => sendJSON(res,data) )
    .catch( next );
});

router.get('/api/v1/:model/:id', auth, (req,res,next) => {

  let user = req.user;
  console.log(user);
  req.model.findOne({_id:req.params.id})
    .then( data => sendJSON(res,data) )
    .catch( next );

//Getting this back from Ovi. How to pass to the 4 quadrant main page? As params?

  //   let data = `{
  //     “name”: “Find”,
  //     “readme”: “http://...github/…./README.md”,
  //     “video”: “http://youtube….”,
  //     “challenges”: [
  //       “http://….github/challenge1.md”,
  // “http://….github/challenge2.md”,
  //     ]
  //   }`

  // res.redirect('http://127.0.0.1:8080/main.html');
});

router.post('/api/v1/:model', (req,res,next) => {
  let record = new req.model(req.body);
  record.save()
    .then( data => sendJSON(res,data) )
    .catch( next );
});

router.put('/api/v1/:model/:id', (req, res, next) => {
  req.model.findByIdAndUpdate(req.params.id, req.body)
    .then(data => sendJSON(res, data))
    .catch(next);
});

router.delete('/api/v1/:model/:id', (req, res, next) => {
  req.model.findByIdAndDelete(req.params.id)
    .then(data => sendJSON(res, data))
    .catch(next);
});

router.post('/api/v1/:model/:id/:studentId', (req, res, next) => {

  console.log(req.body);

  if(!req.body.codeContent || !req.body.comments) {
    return next('title or sample was not provided');
  }
  let record = new req.model(req.body);
  record.save()
    .then( data => sendJSON(res,data) )
    .catch( next );
  
  res.sendStatus(418);
});

// Route with single responsibility to test code
router.post('/api/v1/code', (req, res) => {
  
  let session = new nel.Session();

  const solution = {};
  let onStdoutArray = [];
  let onStderrArray = [];

  let code = req.body.code.trim();
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


let sendJSON = (res,data) => {
  res.statusCode = 200;
  res.statusMessage = 'OK';
  res.setHeader('Content-Type', 'application/json');
  res.write( JSON.stringify(data) );
  res.end();
};

export default router;