'use strict';

import mongoose from 'mongoose';
import superagent from 'superagent';

const githubSchema = mongoose.Schema({
  id: {type: Number, required: true},
  node_id: {type: String, required: true},
  repo_name: {type: String, required: true},
  language: {type: String},
  private: {type: Boolean, required: true},
  html_url: {type: String, required: true},
  description: {type: String},
  createdOn: {type: String, required: true},
  updatedOn: {type: String, required: true}
});


githubSchema.pre('find', function(next) {
  superagent.get('https://api.github.com/users/oviparasca/repos')
  .set('Authorization', 'Bearer ' + '734ed377b3b0e52b9197d8a90fc6458030ee9095') // temporary
  .then(res => {
    console.log('hit the github repo url');
    res => sendJSON(res, res.body);
    // console.log(JSON.stringify(res.body));
  });

  next();
});


githubSchema.pre('findOne', function(next) {
  next();

  // https://api.github.com/repos/OviParasca/branches/00-ES6/master
});



let sendJSON = (res, data) => {
  res.statusCode = 200;
  res.statusMessage = 'OK';
  res.setHeader('Content-Type', 'application/json');
  res.write( JSON.stringify(data) );
  res.end();
 };



export default mongoose.model('github', githubSchema);
