'use strict';

import mongoose from 'mongoose';
import Profile from './profiles.js';

/**
 * Create a `mongoose.Schema` instance for assignments
 * @param {string} courseId (pulls from canvas)
 * @param {Number} assignmentId (pulls from canvas)
 * @param {string} notes (entered by student)
 * @param {Object} code (entered by student)
 * @param {Object} profileID (pulls from profiles)
 * 
 */

const assignmentSchema = mongoose.Schema({
  courseId: {type: String},
  assignmentId: {type:Number},
  assignmentName: {type: String},
  profileId: {type: mongoose.Schema.Types.ObjectId, ref:'profiles'},
  notes: {type: String},
  code: {type: Object},
});

// assignmentSchema.pre('findOne', function(next) {
//   this.populate('profileId');
//   next();
// });

/**
 * Find by profileID and verify if the user profile is valid.
 */
assignmentSchema.pre('save', function (next) {
  let profileId = this.profileId;
  let assId = this._id;

  Profile.findById(profileId)
    .then(user => {
      if (!user) {
        return Promise.reject('Invalid assignment');
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
