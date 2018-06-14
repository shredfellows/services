'use strict';

import express from 'express';
const router = express.Router();
import auth from '../auth/middleware.js';
import Github from '../models/github.js'

//Get One
router.get('/api/v1/github/:assignmentName', (req, res, next) => {
  let assName = req.params.assignmentName;
  
  Github.findOne(assName)
    .then(data => {
      
      sendJSON(res, data);
    }).catch(next);

});

//Get All?
router.get('/api/v1/github', (req, res, next) => {
  Github.find()
    .then(data => {
      sendJSON(res, data);
    }).catch(next);

});

let sendJSON = (res, data) => {
  res.statusCode = 200;
  res.statusMessage = 'OK';
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(data));
  res.end();
};

export default router;