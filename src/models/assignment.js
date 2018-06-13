'use strict';

import mongoose from 'mongoose';
import Profile from './profiles.js';

const assignmentSchema = mongoose.Schema({
  courseId: {type: String},
  assignmentId: {type:Number},
  profileId: {type: mongoose.Schema.Types.ObjectId, ref:'profiles'},
  notes: {type: String},
  code: {
    challenge: { type:String },
  },
});

assignmentSchema.pre('findOne', function(next) {
  this.populate('userId');
  next();
});

assignmentSchema.pre('save', function (next) {
  let profileId = this.userId;
  let assId = this._id;

  Profile.findById(profileId)
    .then(user => {
      if (!user) {
        return Promise.reject('Invalid Team Specified');
      } else {
        Profile.findOneAndUpdate(
          { _id: profileId },
          { $addToSet: { assignments: assId} }
        )
          .then(Promise.resolve())
          .catch(err => Promise.reject(err));
      }
    })
    .then(next())
    .catch(next);
});

export default mongoose.model('assignment', assignmentSchema);