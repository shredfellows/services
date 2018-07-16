'use strict';

import express from 'express';

import auth from '../auth/middleware.js';
import modelFinder from '../middleware/models.js';

const router = express.Router();
router.param('model', modelFinder);

router.get('/api/v1/:model', auth, (req,res,next) => {
  req.model.find({})
    .then( data => sendJSON(res,data) )
    .catch( next );
});

router.get('/api/v1/:model/:id', auth, (req,res,next) => {
  let user = req.user;
  req.model.findOne({_id:req.params.id})
    .then( data => sendJSON(res,data) )
    .catch( next );
});

router.post('/api/v1/:model', auth, (req,res,next) => {
  let record = new req.model(req.body);
  record.save()
    .then( data => sendJSON(res,data) )
    .catch( next );
});

router.put('/api/v1/:model/:id', auth, (req, res, next) => {
  req.model.findByIdAndUpdate(req.params.id, req.body)
    .then(data => sendJSON(res, data))
    .catch(next);
});

router.delete('/api/v1/:model/:id', auth, (req, res, next) => {
  req.model.findByIdAndDelete(req.params.id)
    .then(data => sendJSON(res, data))
    .catch(next);
});

router.post('/api/v1/:model/:id/:studentId', auth, (req, res, next) => {
  
  if(!req.body.codeContent || !req.body.comments) {
    return next('title or sample was not provided');
  }

  let record = new req.model(req.body);
  record.save()
    .then( data => sendJSON(res,data) )
    .catch( next );
});

let sendJSON = (res,data) => {
  res.statusCode = 200;
  res.statusMessage = 'OK';
  res.setHeader('Content-Type', 'application/json');
  res.write( JSON.stringify(data) );
  res.end();
};

export default router;