const express = require('express');
const router = express.Router();

router.post('/Result', (req, res) => {
  const Count = req.body.Count;
  const Result = req.body.Result;

  console.log(`Count: ${Count}`);
  console.log(`Result: ${Result}`);

  res.json({
    Response: 'OK'
  });

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

module.exports = router;