'use strict';

const mongoose = require('mongoose');

const assignmentSchema = mongoose.Schema({
  coursesId: [  course: [ {type:mongoose.Schema.Types.ObjectId, ref:'course'}],
  courseId:(type:Number, require:true),
  assignmentID:(type:Number),
});

courseSchema.pre('findCourse', function(next) {
  this.populate('course');
  next();
});

export default mongoose.model('assignment', assignmentSchema);
