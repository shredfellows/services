'use strict';

import express from 'express';
import Assignment from '../models/assignment.js';
import User from '../models/user.js';

app.get('api/v1/model/assignment/:studentid/assignment', (req, res, next) => {
  Assignment.find({})
   .then (data => sendJSON(res, data))
    .catch(next);
});

app.post('api/v1/model/assignment/:assignmentid/:studentid', (req, res, next) => {
  let note = new req.model(req.body);
  record.save()
    .then (data => sendJSON(res, data))
    .catch(next);
});

app.put('api/v1/model/assignment/:assignmentid/:studentid', (req, res, next) => {
  req.model.update(req.params.notes)
    .then (data => sendJSON(res, data))
    .catch(next);
});