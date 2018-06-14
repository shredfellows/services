'use strict';

// Read in everything from the models folder
import requireAll from 'require-dir';
const models = requireAll(`${__dirname}/../models`);

/*
  models: {
    'players': {
      'default': Function()
    }
  }
 */

export default (req,res,next) => {
  let model = req.params.model;
  // If we have a valid model specified and available as a module, assign that to req.model
  // and then continue on with the application, otherwise, force an error state
  if(model && models[model] && models[model].default ) {
    req.model = models[model].default;
    next();
  }
  else {
    next(`Model ${model} Not Found`);
  }
};

