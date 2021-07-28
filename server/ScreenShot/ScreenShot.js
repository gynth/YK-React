const express = require('express');
const router = express.Router();
const fs = require('fs');

router.post('/TEST', (req, res) => {
  res.json();
  res.json();
  res.json();

  // const img = req.body.img.replace('data:image/png;base64,', '');
  // let filename = req.body.filename;
  // let root = req.body.root;

  // if(root === undefined){
  //   if(!fs.existsSync('../screenshot')){
  //     fs.mkdirSync('../screenshot');
  //   }

  //   root = `../screenshot/${getToday()}`;

  //   if(!fs.existsSync(root)){
  //     fs.mkdirSync(root);
  //   }
  // }

  // if(filename === undefined){
  //   filename = `${getCurrentDate()}.png`;
  // }

  // fs.writeFile(`${root}\\${filename}`, img, 'base64', function(err) {
  //   res.json(err);
  // });
});

router.post('/', (req, res) => {

  const img = req.body.img.replace('data:image/png;base64,', '');
  let filename = req.body.filename;
  let root = req.body.root;

  if(root === undefined){
    if(!fs.existsSync('../screenshot')){
      fs.mkdirSync('../screenshot');
    }

    root = `../screenshot/${getToday()}`;

    if(!fs.existsSync(root)){
      fs.mkdirSync(root);
    }
  }

  if(filename === undefined){
    filename = `${getCurrentDate()}.png`;
  }

  fs.writeFile(`${root}\\${filename}`, img, 'base64', function(err) {
    res.json(err);
  });
});

const getToday = () => {
  var date = new Date();
  var year = date.getFullYear();
  var month = ("0" + (1 + date.getMonth())).slice(-2);
  var day = ("0" + date.getDate()).slice(-2);

  return year + month + day;
}

const getCurrentDate = () => {
  var date = new Date();

  var hour = date.getHours();
  hour = hour < 10 ? '0' + hour.toString() : hour.toString();

  var minites = date.getMinutes();
  minites = minites < 10 ? '0' + minites.toString() : minites.toString();

  var seconds = date.getSeconds();
  seconds = seconds < 10 ? '0' + seconds.toString() : seconds.toString();

  return hour + minites + seconds;
}

module.exports = router;