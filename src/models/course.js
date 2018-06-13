'use strict';

const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({

  gitHubLink:{type:Number, required:true},
  canvasID:{type:Number, required:true},
  name: {type:String, required:true},
  students: [ {type:mongoose.Schema.Types.ObjectId, ref:'user'}],

});

courseSchema.pre('findStudents', function(next) {
  this.populate('students');
  next();
});

export default mongoose.model('course', courseSchema);
