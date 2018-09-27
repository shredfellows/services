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
  res.send(req.profile);
});

authRouter.get('/oauth', (req, res, next) => {
  let clientUrl = process.env.CLIENT_URL + '/dashboard';
  oauth.authorize(req)
    .then(token => {
      res.cookie('Token', token);
      res.cookie('GHT', process.env.GITHUB_TOKEN);
      res.redirect(clientUrl);
    })
    .catch(next);
});

authRouter.get('/logout', (req, res, next) => {
  res.clearCookie('Token', '');
  res.clearCookie('GHT', '');
  res.redirect(process.env.CLIENT_URL);
});

export default authRouter;
