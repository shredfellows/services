'use strict';


import mongoose from 'mongoose';
import User from 'user.js';


//Create model to store the following info for each assignment: courseID(from canvas), assignmentID(from canvas), studentID (from users), notes(input from user), code(input from user).
const assignmentSchema = mongoose.Schema({
  courseId:{type:String, required:true},
  assignmentId:{type:Number},
  code:{type:String},
  notes:{type:String},
  user: { type:mongoose.Schema.Types.ObjectId, ref:'user' },
});

assignmentSchema.pre('save', function(next) {
 this.populate('user');
  next();
});


export default mongoose.model('assignment', assignmentSchema);
