'use strict';

import requireAll from 'require-dir';
const models = requireAll(`${__dirname}/../models`);

export default (req,res,next) => {
  let model = req.params.model;

  if(model && models[model] && models[model].default ) {
    req.model = models[model].default;
    next();
  }
  else {
    next(`Model ${model} Not Found`);
  }
};

