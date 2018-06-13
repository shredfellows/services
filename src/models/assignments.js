'use strict';

const mongoose = require('mongoose');
import Profiles from '../models/profiles.js';

const assignmentSchema = mongoose.Schema({
  //name: {type:String, required:true},
  assignmentId: {type:String, required:true},
  codeContent: {type:String, required:true},
  comments: {type:String},
  url: {type:String},
  profileID: { type: mongoose.Schema.Types.ObjectId, ref: 'profiles' },
});

assignmentSchema.pre('findOne', function(next) {
  console.log('pre findOne this', this);
  this.populate('profileID');
  next();
});

assignmentSchema.pre('save', function(next) {
 
  let assignmentId = this._id;
  let profileID = this.profileID;
  console.log('This is the userID', userId);

  // Is the user that we try to add to valid?
   Profiles.findById(profileID)
    .then(user => {
      if( !user ) {
        return Promise.reject('Invalid Profile Specified');
      }
      else {
        Profiles.findOneAndUpdate(
          {_id:profileID},
          { $addToSet: {assignments:assignmentId} }
        )
          .then( Promise.resolve() )
          .catch(err => Promise.reject(err) );
      }
    })
    .then(next())
    .catch(next);
  // If so, add this assignment to the assignments array in that team.



});

export default mongoose.model('assignments', assignmentSchema);