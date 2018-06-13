'use strict';


import mongoose from 'mongoose';
import User from 'user.js';

const assignmentSchema = mongoose.Schema({
  courseId:{type:String},
  assignmentId:{type:Number},
  code:{type:String},
  notes:{type:String},
  user: { type:mongoose.Schema.Types.ObjectId, ref:'user' },
});

assignmentSchema.pre('findOne', function(next) {
  this.populate('user');
  next();
});

export default mongoose.model('assignment', assignmentSchema);
