'use strict';


import mongoose from 'mongoose';
import User from 'user.js';


//Create model to store the following info for each assignment: courseID(from canvas), assignmentID(from canvas), studentID (from users), notes(input from user), code(input from user).
const assignmentSchema = mongoose.Schema({
  course_id:{type:String},
  assignment_id:{type:Number},
  student_id: { type:mongoose.Schema.Types.ObjectId, ref:'user' },
  notes:{type:String},
  code:{
      challenge1:String,
    }
});

assignmentSchema.pre('save', function(next) {
 this.populate('user');
  next();
});


export default mongoose.model('assignment', assignmentSchema);
