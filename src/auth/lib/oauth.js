'use strict';

import superagent from 'superagent';

import User from '../model';
import Profile from '../../models/profiles';

const authorize = (req, res) => {

  let URL = process.env.CLIENT_URL;
  let code = req.query.code;

  console.log('(1) code', code);

  // exchange the code or a token
  return superagent.post('https://github.com/login/oauth/access_token')
    .type('form')
    .send({
      code: code,
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      redirect_uri: `${process.env.API_URL}/oauth`,
      grant_type: 'authorization_code',
    })
    .then(response => {
      let gitToken = response.body.access_token;
      console.log('(2) github token', gitToken);
      return gitToken;
    })
    .then(token => {
      let githubUser = {};

      return superagent.get('https://api.github.com/user')
        .set('Authorization', `Bearer ${token}`)
        .then(response => {
          console.log('(3) Github User username', response.body.login);
          githubUser['username'] = response.body.login;
        
          return superagent.get('https://api.github.com/user/emails')
            .set('Authorization', `Bearer ${token}`)
            .then(response => {
              console.log('(4) Github User email', response.body[0].email);
              githubUser['email'] = response.body[0].email;

              return githubUser;
            });
        });
    })
    .then(githubUser => {
      console.log(`(5) github user: ${githubUser.username}, ${githubUser.email}`);
      return User.createFromOAuth(githubUser);
    })
    .then(user => {
      return user.generateToken();
    })
    .then(token => {
      console.log(`(6) token: ${token}`);
      res.cookie('Token ', token);
      res.redirect(URL);
    })
    .then(profile => {
      return profile.generateToken();
    })
    .catch(error => error);
};

export default {authorize};