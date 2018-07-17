'use strict';

import superagent from 'superagent';
const github = {};

github.find = () => {
  return superagent.get(process.env.GITHUB_ASSIGNMENTS_URL)
    .set({
      'Authorization': 'Bearer ' + process.env.GITHUB_TOKEN,
    })
    .then(res => {
      return parseContents(res.body, process.env.GITHUB_ASSIGNMENTS_URL);
    });
};

github.findOne = (req) => {
  return superagent.get(process.env.GITHUB_ASSIGNMENTS_URL + req.split(/[ .]+/).join('/'))
    .set({
      'Authorization': 'Bearer ' + process.env.GITHUB_TOKEN,
    })
    .then(res => {
      return parseFolder(res.body, process.env.GITHUB_ASSIGNMENTS_URL + req.split(/[.]+/).join('/'));
    }).catch(console.error);
};

function parseContents(data, url) {
  const promises = [];

  for (var i = 0; i < data.length; i++) {
    if (data[i].type === 'dir') {
      promises.push(getSubDirectories(data[i].name, url + data[i].path));
    }
  }

  return Promise.all(promises).then(values => {
    var contents = {};
    values.forEach(value => {
      Object.keys(value).map(function (key) {
        contents[key] = value[key];
      });
    });

    return contents;
  });
}

function getSubDirectories(key, directory) {
  return superagent.get(directory)
    .set({
      'Authorization': 'Bearer ' + process.env.GITHUB_TOKEN,
    })
    .then(res => {
      var obj = {};
      for (var i = 0; i < res.body.length; i++) {
        if (res.body[i].type === 'dir') {
          obj[res.body[i].name] = `${process.env.CLIENT_URL}/${res.body[i].path.replace('/', '.')}`;
        }
      }
      var parentObj = {
        [key]: obj,
      };
      return parentObj;
    });
}

function parseFolder(data, url) {
  const promises = [];
  var contents = {};
  contents['name'] = url.split('/').pop().trim();

  for (var i = 0; i < data.length; i++) {
    if (data[i].name === 'challenges') {
      promises.push(getChallenges(url+'/challenges/'));
    }

    if (data[i].name === 'README.md') {
      contents['readme'] = data[i].download_url;
    }

    if (data[i].name === 'config.json') {
      promises.push(parseFile(data[i].download_url));
    }
  }


  return Promise.all(promises).then(values => {
    var challenges = {};
    values.forEach(value => {
      Object.keys(value).map(function (key) {
        if (key === 'video') {
          contents['video'] = value.video;
        }
        if (key.includes('challenge')) {
          challenges[key] = value[key];
        }
      });
    });
    contents['challenges'] = challenges;
    return contents;
  });

}

function parseFile(fileURL) {
  return superagent.get(fileURL)
    .then(res => {
      return JSON.parse(res.text);
    });
}

function getChallenges(url) {
  return superagent.get(url)
    .set({
      'Authorization': 'Bearer ' + process.env.GITHUB_TOKEN,
    })
    .then(res => {
      var content = {};
      for (var i = 0; i < res.body.length; i++) {
        content[res.body[i].name.split('.')[0]] = res.body[i].download_url;
      }
      return content;
    });
}

export default github;
