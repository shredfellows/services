'use strict';

import superagent from 'superagent';

import User from '../model';
import Profile from '../../models/profiles';

const authorize = (req, res) => {

  let URL = process.env.CLIENT_URL;
  let code = req.query.code;

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
      return gitToken;
    })
    .then(token => {
      let githubUser = {};

      return superagent.get('https://api.github.com/user')
        .set('Authorization', `Bearer ${token}`)
        .then(response => {
          githubUser['name'] = response.body.name;
          githubUser['username'] = response.body.login;
          githubUser['profileImage'] = response.body.avatar_url;
        
          return superagent.get('https://api.github.com/user/emails')
            .set('Authorization', `Bearer ${token}`)
            .then(response => {
              githubUser['email'] = response.body[0].email;

              return githubUser;
            });
        });
    })
    .then(githubUser => {
    // THIS IS FOR TESTING PURPOSES
      console.log('USER FROM GH', githubUser);
    // TESTING................
      return User.createFromOAuth(githubUser)
        .then(user => {
          githubUser.userId = user._id;
          return Profile.createFromOAuth(githubUser);
        });
    })
    .then(profile => {
      return profile.generateToken();
    })
    .catch(error => error);
};

export default {authorize};
