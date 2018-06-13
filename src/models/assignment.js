'use strict';


import mongoose from 'mongoose';
// import User from 'user.js';

const assignmentSchema = mongoose.Schema({
  course_id:{type:String},
  assignment_id:{type:Number},
  // student_id: { type:mongoose.Schema.Types.ObjectId, ref:'user' },
  user: {type:String},
  notes:{type:String},
  code:{
    challenge1:String,
  },
});

assignmentSchema.pre('save', function(next) {
  this.populate('user');
  next();
});


export default mongoose.model('assignment', assignmentSchema);
