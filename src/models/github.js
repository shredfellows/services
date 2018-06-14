'use strict';

import superagent from 'superagent';

const github = {};
const baseURL = 'https://api.github.com/repos/shredfellows/assignments/contents/';
const localHostURL = 'http://localhost:3000/api/v1/github/';


github.find = () => {
  return superagent.get(baseURL)
    .set({'Authorization': 'Bearer ' + process.env.GITHUB_TOKEN})
    .then(res => {   
      return parseContents(res.body, baseURL);
    });
};

// TODO:
github.findOne = (req) => {
  
  console.log(baseURL + req.split(/[ .]+/).join('/'));
  return superagent.get(baseURL + req.split(/[ .]+/).join('/'))
    .set({'Authorization': 'Bearer ' + process.env.GITHUB_TOKEN})
    .then(res => {    
    
      return res.body;
    }).catch(console.error);
};



// Helper functions

function parseContents(data, url) {
  const promises = [];

  for (var i = 0; i < data.length; i++) {
    if (data[i].type === 'dir') {
      promises.push(getSubDirectories(data[i].name, url+data[i].path));
    }
  }

  return Promise.all(promises).then(values => {
    var contents = {};
    values.forEach(value => {
      Object.keys(value).map(function (key){ 
        console.log(value[key]);
        console.log(key);
        contents[key] = value[key];
      });
    });

    return contents;
  });
}

function getSubDirectories(key, directory) {
  return superagent.get(directory)
    .set({'Authorization': 'Bearer ' + process.env.GITHUB_TOKEN})
    .then(res => {  
      var obj = {};
      for (var i = 0; i < res.body.length; i++) {
        if (res.body[i].type === 'dir') {
          obj[res.body[i].name] = `${localHostURL}${res.body[i].path.replace('/', '.')}`;
        }
      }
      var parentObj = {[key] : obj};
      return parentObj;
    });
}


export default github;
