'use strict';

import mongoose from 'mongoose';

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
  next();

  // https://api.github.com/users/oviparasca/repos
});


githubSchema.pre('findOne', function(next) {
  next();

  // https://api.github.com/users/oviparasca/repos
});


export default mongoose.model('github', githubSchema);
