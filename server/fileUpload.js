const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

//diskStorage 엔진으로 파일저장경로와 파일명을 세팅한다. 
let storage = multer.diskStorage({ //multer disk storage settings
    
    destination: function(req, file, callback) {
      if(!fs.existsSync(`F:/IMS`)){
        fs.mkdirSync(`F:/IMS`);
      }

      if(!fs.existsSync(`F:/IMS/Notice`)){
        fs.mkdirSync(`F:/IMS/Notice`);
      }
      
      const root = `F:/IMS/Notice/${req.body.body}`;
      
      if(!fs.existsSync(root)){
        fs.mkdirSync(root);
      }

      callback(null, root)
    },
    filename: function(req, file, callback) {
      let extension = path.extname(file.originalname);
      let basename = path.basename(file.originalname, extension);
      callback(null, basename + extension);
    }
});

//특정 파일형식만 저장하기 위해서는 fileFilter함수를 사용한다. 
const upload = multer({ //multer settings
    storage: storage,
    fileFilter: function(req, file, callback) {
      var ext = path.extname(file.originalname);
      if (ext !== '.xlsx' && ext !== '.txt' && ext !== '.ppt' && ext !== '.pptx' && ext !== '.pdf' && ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
          return callback(new Error('Only .xlsx .pdf .png, .jpg .gif and .jpeg format allowed!'))
      }
      callback(null, true)
    }
}).any(); //.any()는 전달받는 모든 파일을 받는다. 파일배열은 req.files에 저장되어 있다. 

router.post('/Delete', (req, res) => {
  const NOTICE_NO = req.body.NOTICE_NO;

  fs.rmdirSync(`F:/IMS/Notice/${NOTICE_NO}`, {recursive: true});

  res.json('OK');
})

router.post('/DeleteFile', (req, res) => {
  const NOTICE_NO = req.body.NOTICE_NO;
  const FILE = req.body.FILE;

  fs.rmSync(`F:/IMS/Notice/${NOTICE_NO}/${FILE}`);

  res.json('OK');
})

router.post('/Upload', (req, res, next) => {
  
  const reqFiles = [];
  try {
    upload(req, res, function(err) {
      if (err) {
        console.log(err)
        return res.status(400).send({ //에러발생하면, 에러 메시지와 빈 파일명 array를 return한다. 
          message: err.message,
          files: reqFiles
        });
      }

      for (var i = 0; i < req.files.length; i++) { //저장된 파일명을 차례로 push한다. 
          reqFiles.push(req.files[i].filename)
      }

      res.status(200).send({ //저장 성공 시, 저장성공 메시지와 저장된 파일명 array를 return한다. 
          message: 'Uploaded the file successfully',
          files: reqFiles
      });
    })
  } catch (err) {
      console.log(err);
      res.status(500).send({
          message: `Could not upload the file: ${err}`,
          files: reqFiles
      });
  }
});

module.exports = router;