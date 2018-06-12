'use strict';

import mongoose from 'mongoose';
import Teams from './teams.js';

const playerSchema = mongoose.Schema({
  name: { type:String, required:true },
  position: { type:String, uppercase:true, required:true },
  bats: { type:String, uppercase:true, default:'R', enum:['R','r','L','l'] },
  throws: { type:String, uppercase:true, default:'R', enum:['R','r','L','l'] },
  team: { type:mongoose.Schema.Types.ObjectId, ref:'teams' },
});

playerSchema.pre('findOne', function(next) {
  this.populate('team');
  next();
});

playerSchema.pre('save', function(next) {

  let playerId = this._id;
  let teamId = this.team;

  // Is the team that we try to add the player to, valid?
  Teams.findById(teamId)
    .then(team => {
      if( !team ) {
        return Promise.reject('Invalid Team Specified');
      }
      else {
        Teams.findOneAndUpdate(
          {_id:teamId},
          { $addToSet: {players:playerId} }
        )
          .then( Promise.resolve() )
          .catch(err => Promise.reject(err) )
      }
    })
    .then(next())
    .catch(next);
  // If so, add this player to the players array in that team.



});

export default mongoose.model('players', playerSchema);