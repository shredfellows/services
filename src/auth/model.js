'use strict';

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


/**
 * Create a `mongoose.Schema` instance 
 * @param {String} username
 * @param {String} password
 * @param {String} email 
 */

const userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: {type: String, required: true},
  profile: { type: mongoose.Schema.Types.ObjectId, ref: 'profiles' },
});


/**
 * This function hashes the password before saving to the database.
 * @param {string} password
 */
userSchema.pre('save', function(next) {
  bcrypt.hash(this.password,10)
    .then(hashedPassword => {
      this.password = hashedPassword;
      next();
    })
    .catch( error => {throw error;} );
});

/**
 * This function validates user email and throws error if an invalid email, creates new account if does not exist, or welcomes back a previous user.
 * @param {string} incoming.email
 * @param {string} password
 */
userSchema.statics.createFromOAuth = function(incoming) {
  if (!incoming || !incoming.email ) {
    return Promise.reject('VALIDATION ERROR: missing username/email or password ');
  }

  return this.findOne({email:incoming.email})
    .then(user => {
      if ( ! user ) { throw new Error ('User Not Found'); }
      console.log('Welcome Back', user.username);
      return user;
    })
    .catch( error => { // eslint-disable-line
      let username = incoming.email;
      let password = 'none';
      return this.create({
        username: username,
        password: password,
        email: incoming.email,
      });
    });

};
/**
 * Finds the user and verifies that the password given matches the password in the database
 * @method authenticate
 * @param {object} auth
 * @param {String} auth.username - the username 
 * @param {String} auth.password - the password
 */
userSchema.statics.authenticate = function(auth) {
  let query = {username:auth.username};
  return this.findOne(query)
    .then(user => user && user.comparePassword(auth.password))
    .catch(error => error);
};
/**
 * verifies that the token given matches a particular user
 * @method authorize
 * @param {String} token - a jwt token that contains user_id
 
 */
userSchema.statics.authorize = function(token) {
  let parsedToken = jwt.verify(token, process.env.SECRET || 'changeit');
  let query = {_id:parsedToken.id};
  return this.findOne(query)
    .then(user => {
      return user;
    })
    .catch(error => {error;});
};

/** Compare the password given with the password in the database attached to the user
 * @method comparePassword
 * @param {String} - the password to compare
 */
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password)
    .then(valid => valid ? this : null);
};

/** Generates a jwt token that contains the user_id
 * @method generateToken
 */

userSchema.methods.generateToken = function() {
  return jwt.sign( {id:this._id}, process.env.SECRET || 'changeit' );
};

export default mongoose.model('users', userSchema);
