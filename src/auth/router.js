'use strict';

import express from 'express';

const authRouter = express.Router();

import User from './model.js';
import auth from './middleware.js';
import oauth from './lib/oauth.js';

authRouter.post('/signup', (req, res, next) => {
  let user = new User(req.body);
  user.save()
    .then( user => res.send(user.generateToken()) )
    .catch(next);
});

authRouter.get('/login', auth, (req, res, next) => {
  res.cookie('Token', req.token);
  res.send(req.user);
});

authRouter.get('/oauth', (req, res, next) => {
  oauth.authorize(req)
    .then(token => {
      console.log('HERES THE TOKEN WE NEED: ', token);
      res.cookie('Token', token);
      res.cookie('GHT', process.env.GITHUB_TOKEN);
      res.redirect(process.env.CLIENT_URL);
    })
    .catch(next);
});

export default authRouter;
