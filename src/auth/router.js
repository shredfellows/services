'use strict';

import express from 'express';

const authRouter = express.Router();

import User from './model.js';
import auth from './middleware.js';
import oauth from './lib/oauth.js';

// Generally, these will send a Token Cookie and do a redirect.
// For now, just spew out the token to prove we're ok.

authRouter.post('/signup', (req, res, next) => {
  let user = new User(req.body);
  user.save()
    .then( user => res.send(user.generateToken()) )
    .catch(next);
});

authRouter.get('/login', auth, (req, res, next) => {
  console.log(req.user);
  res.cookie('Token', req.token);
  res.send(req.user);
});

authRouter.get('/oauth', (req, res, next) => {

  console.log(req.query.state);  
  let assignmentName = req.query.state;
  let URL = process.env.API_URL + `/api/v1/github/${assignmentName}`;
  //let URL = process.env.API_URL + `/api/v1/profiles`;


  // Offload the oauth handshaking process to a module designed
  // to do that job. The route itself shouldn't contain any logic...
  oauth.authorize(req)
    .then ( token => {
      console.log('Token is: ', token);
      res.cookie('Token', token);
      res.redirect(process.env.CLIENT_URL);
    })
    .catch(next);
});


export default authRouter;
