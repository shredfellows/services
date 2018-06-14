'use strict';

import superagent from 'superagent';

import User from '../model';
import Profile from '../../models/profiles'

// This is currently setup for Google, but we could easily swap it out
// for any other provider or even use a totally different module to
// to do this work.
//
// So long as the method is called "authorize" and we get the request,
// we should be able to roll on our own here...

const authorize = (req) => {

  let code = req.query.code;

  console.log('(1) code', code);

  // exchange the code or a token
  return superagent.post('https://www.googleapis.com/oauth2/v4/token')
    .type('form')
    .send({
      code: code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.API_URL}/oauth`,
      grant_type: 'authorization_code',
    })
    .then( response => {
      console.log('response is: ', response.body);
      //response = JSON.parse(response.body);
      let googleToken = response.body.access_token;
      //let refreshToken = response.refresh_token;
      //let userId = response.user.id;
      //let userName = response.user.name;
      //let googleUser = {userName: userName, userId: userId };
      console.log('(2) google token', googleToken);
      //console.log('(2b) refresh token', refreshToken);
      return googleToken;
    })
  //use the token to get a user
    .then ( token => {
      return superagent.get('https://www.googleapis.com/plus/v1/people/me/openIdConnect')
        .set('Authorization', `Bearer ${token}`)
        .then (response => {
          let user = response.body;
          console.log('(3) Google User', user);
          return user;
        });
    })
    .then(googleUser => {
      console.log('(4) Creating Account')
      return User.createFromOAuth(googleUser);
    })
    //Create new Profile here? Something like...
    .then(user => {
      console.log('(5) Creating Profile')
      return Profile.createFromOAuth(user);
    })
    .then (profile => {
      console.log('Profile is ', profile);
      console.log('(6) Created User, generating token');
      return profile.generateToken();
    })
    .catch(error=>error);
};



export default {authorize};
