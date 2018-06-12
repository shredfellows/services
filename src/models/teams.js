'use strict';

const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
  name: {type:String, require:true},
  players: [ {type:mongoose.Schema.Types.ObjectId, ref:'players'}],
});

teamSchema.pre('findOne', function(next) {
  this.populate('players');
  next();
});

export default mongoose.model('teams', teamSchema);