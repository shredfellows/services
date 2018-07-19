'use strict';

import User from './model.js';
import Profile from '../models/profiles.js';


/** A module that checks the authorization headers and authenticates or authorizes the user
 * @module auth/middleware
 */

export default (req, res, next) => {
/**
 * The authorize function uses the member function authorize() on the user model
 * @param {string} token - The token that is sent as a cookie and then set bearer token.
 */
  let authorize = (token) => {
    console.log('token coming into profile authorize', token);
    Profile.authorize(token)
      .then(profile => {
        console.log(profile);
        if(!profile) { getAuth(); }
        else { 
          req.profile = profile;
          next(); }
      })
      .catch(next);
  };
  /**
 * This authenticate() function uses the member function authenticate on the user model
 * @param {object} auth - contains the username and password input
 * @param {string} auth.username - the username
 * @param {string} auth.password - the password of user
 */
  let authenticate = (auth) => {
    User.authenticate(auth)
      .then(user => {
        if (!user) { getAuth(); }
        else {
          req.token = user.generateToken();
          next();
        }
      })
      .catch(next);
  };

  let getAuth = () => {
    next({status:401,statusMessage:'Unauthorized',message:'Invalid User ID/Password'});
  };

  try {
    let auth = {};
    let authHeader = req.headers.authorization;
    if(!authHeader) {
      return getAuth();
    }

    if(authHeader.match(/basic/i)) {
      let base64Header = authHeader.replace(/Basic\s+/i, '');
      let base64Buffer = Buffer.from(base64Header,'base64');
      let bufferString = base64Buffer.toString();
      let [username,password] = bufferString.split(':');
      auth = {username,password};

      authenticate(auth);
    }
    else if(authHeader.match(/bearer/i)) {
      let token = authHeader.replace(/bearer\s+/i, '');
      authorize(token);
    }
  } catch(e) {
    next(e);
  }

};


