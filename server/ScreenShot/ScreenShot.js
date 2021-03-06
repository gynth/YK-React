const express = require('express');
const router = express.Router();
const fs = require('fs');
const fsPromises = fs.promises;
const soap = require('soap'); 
const sharp = require('sharp');
const axios = require('axios');
const ftp = require("basic-ftp");

const callLog = async(folder, msg) => {
  const host = 'http://localhost:3001/Log';
  // const host = 'http://211.231.136.182:3001/Oracle/SP';
  const option = {
    url   : host,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data: {
      folder,
      msg
    } ,
    timeout: 30000
  };

  return axios(option)
    .then(res => {
      return res
    })
    .catch(err => {
      console.log(err)
      return err;
    })
}

router.post('/Milestone', (req, res) => {
  let device = req.body.device;
  let scaleNo = req.body.scaleNo;
  let folder = scaleNo.substring(0, 8);
  let fileName = req.body.fileName;

  // if(!fs.existsSync(`${__dirname}/Screenshot`)){
  //   fs.mkdirSync(`${__dirname}/Screenshot`);
  // }
  if(!fs.existsSync(`F:/IMS`)){
    fs.mkdirSync(`F:/IMS`);
  }

  if(!fs.existsSync(`F:/IMS/Screenshot`)){
    fs.mkdirSync(`F:/IMS/Screenshot`);
  }

  if(!fs.existsSync(`F:/IMS/Screenshot/${folder}`)){
    fs.mkdirSync(`F:/IMS/Screenshot/${folder}`);
  }

  const root = `F:/IMS/Screenshot/${folder}/${scaleNo}`;
  // const root = `C:/IMS/Screenshot/${scaleNo}`;

  if(!fs.existsSync(root)){
    fs.mkdirSync(root);
  }

  const MilestoneIP = global.MILESTONE_IP;
  const token       = global.MILESTONE_TOKEN;
  const deviceId    = device;

  var url = `http://${MilestoneIP}:7563/RecorderCommandService/RecorderCommandService.asmx?wsdl`;
  soap.createClient(url, (err, client) => {

    client.JPEGGetLive({token, deviceId, maxWidth:1280, maxHeight:1024}, (e, r) => {
      // const img = `data:image/JPEG;base64,${r.JPEGGetLiveResult.Data}`;
      const img = `${r.JPEGGetLiveResult.Data}`;
      if(e === null){
        let filename = `${getCurrentDate()}.jpg`;
        if(fileName !== undefined && fileName !== null && fileName !== ''){
          filename = `${getCurrentDate()}${fileName}.jpg`;
        }

        fs.writeFile(`${root}/${filename}`, img, 'base64', function(err) {
          if(err === null){
            res.json({Result: 'OK'})
          }else{
            callLog('ScreenShot', `createClient1: ${err}`);
            res.json({Result: err});
          }
        }); 
      }else {
        callLog('ScreenShot', `createClient2: ${err}`);
        res.json({Result: e});
      }
    }) 
  })
})

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
    filename = `${getCurrentDate()}.jpg`;
  }

  fs.writeFile(`${root}/${filename}`, img, 'base64', function(err) {
    res.json(err);
  });
});

//#region ????????? ????????????
router.post('/YK_Chit_YN', (req, res) => {
  const scaleNo = req.body.scaleNo;
  const folder = scaleNo.substring(0, 8);

  if(fs.existsSync(`F:/IMS/scaleChit/${folder}/${scaleNo}.jpg`)){
    // const readFile = fs.readFileSync(`F:/IMS/scaleChit/${folder}/${scaleNo}.jpg`);
    // const encode = Buffer.from(readFile).toString('base64');
    // res.end(encode);
    res.json('Y');
  }else{
    res.json('N');
  }
});   

router.post('/YK_Chit_YN_Tally', (req, res) => {
  const fileName = req.body.fileName;
  
  try{
    const readFile = fs.readFileSync(`F:/IMS/scaleChit/${fileName.substring(0, 8)}/${fileName}`);
    const encode = Buffer.from(readFile).toString('base64');
  
    res.json({
      encode
    })
  }catch(e){
    callLog('ScreenShot', `YK_Chit_YN_Tally: ${e}`);
    res.json({
      encode: 'N'
    })
  }finally{

  }
});   

//#endregion

//#region ????????? ????????????
router.post('/YK_Chit_file_yn', (req, res) => {
  const filename = req.body.filename;
  const folder = filename.substring(0, 8);

  if(!fs.existsSync(`F:/IMS/scaleChit/${folder}/${filename}`)){
    res.json('N');
  }else{
    res.json('Y');
  }
})
//#endregion

//#region ????????? ??????
router.post('/YK_Chit_Mobile', (req, res) => {
  
  const img = req.body.img.replace('data:image/png;base64,', '');
  // const img = req.body.img.replace('data:image/jpeg;base64,', '');
  
  const filename = req.body.filename;
  const folder = filename.substring(0, 8);
  
  if(!fs.existsSync(`F:/IMS`)){
    fs.mkdirSync(`F:/IMS`);
  }
  if(!fs.existsSync(`F:/IMS/scaleChit`)){
    fs.mkdirSync(`F:/IMS/scaleChit`);
  }
  if(!fs.existsSync(`F:/IMS/scaleChit/${folder}`)){
    fs.mkdirSync(`F:/IMS/scaleChit/${folder}`);
  }

  makeImgMobile(img, folder, filename).then(e => {
    res.json(e);
  });
  
  // if(!fs.existsSync(`F:/IMS/scaleChit/${folder}/${filename}`)){
  //   makeImgMobile(img, folder, filename).then(e => {
  //     res.json(e);
  //   });
  // }else{
  //   res.json('OK');
  // }
})

router.post('/Ftp_File_Yn', async(req, res) => {
  const scaleNumb = req.body.scaleNumb;
  let Client = require('ssh2-sftp-client');
  let sftp = new Client();
  
  sftp.connect({
    host: '10.10.10.139',
    port: 22,
    username: 'ims',
    password: 'wjdqhykims'
  }).then((e) => {
    return sftp.exists(`/data/apache-tomcat-9.0.10/webapps/TALLY/Images/scaleChit/${scaleNumb.substring(0, 8)}/${scaleNumb}.jpg`);
  })
  .then(data => {
    res.json(data);
  })
  .then(() => {
    sftp.end();
  })
  .catch(err => {
    callLog('ScreenShot', `YK_Chit_YN_Tally: ${err.message}`);
    console.error(err.message);
  });
})

router.post('/YK_Chit', async (req, res) => {

  const img = req.body.img.replace('data:image/png;base64,', '');
  const filename = req.body.filename;
  const folder = filename.substring(0, 8);
  const mobileYn = req.body.mobileYn;

  if(!fs.existsSync(`F:/IMS`)){
    fs.mkdirSync(`F:/IMS`);
  }
  if(!fs.existsSync(`F:/IMS/scaleChit`)){
    fs.mkdirSync(`F:/IMS/scaleChit`);
  }
  if(!fs.existsSync(`F:/IMS/scaleChit/${folder}`)){
    fs.mkdirSync(`F:/IMS/scaleChit/${folder}`);
  }

  await makeFolder(folder);
  const result = await makeImg(img, folder, filename, mobileYn)
  if(result === 'Y'){

    let from = fs.createReadStream(`F:/IMS/scaleChit/${folder}/${filename}.jpg`);
    let to = `/data/apache-tomcat-9.0.10/webapps/TALLY/Images/scaleChit/${folder}/${filename}.jpg`;

    let Client = require('ssh2-sftp-client');
    let sftp = new Client();
    
    sftp.connect({
      host: '10.10.10.139',
      port: 22,
      username: 'ims',
      password: 'wjdqhykims'
    }).then((e) => {
      return sftp.put(from, to);
    })
    .then(data => {
      console.log(data);          // will be false or d, -, l (dir, file or link)
      res.json(data);
    })
    .then(() => {
      console.log('FTP Done');
      sftp.end();
    })
    .catch(err => {
      callLog('ScreenShot', `YK_Chit: ${err.message}`);
      console.error(err.message);
    });
  }
}); 

const makeFolder = async(folder) => {    
  let root = `/data/apache-tomcat-9.0.10/webapps/TALLY/Images/scaleChit/${folder}`;
  let Client = require('ssh2-sftp-client');
  let sftp = new Client();
  
  sftp.connect({
    host: '10.10.10.139',
    port: 22,
    username: 'ims',
    password: 'wjdqhykims'
  }).then((e) => {
    return sftp.exists(root);
  })
  .then(data => {
    if(data === false){
      return sftp.mkdir(`/data/apache-tomcat-9.0.10/webapps/TALLY/Images/scaleChit/${folder}`, true);
    }
  })
  .then(() => {
    sftp.end();
  })
  .catch(err => {
    callLog('ScreenShot', `makeFolder: ${err.message}`);
    console.error(err.message);
  });
}

const makeImg = async(img, folder, filename, mobileYn) => {

  const root = `F:/IMS/scaleChit/${folder}/${filename}_temp1.png`;
  const root1 = `F:/IMS/scaleChit/${folder}/${filename}_temp2.png`;
  const root2 = `F:/IMS/scaleChit/${folder}/${filename}_temp3.png`;
  const root3 = `F:/IMS/scaleChit/${folder}/${filename}.jpg`;
  const root4 = `F:/IMS/scaleChit/${folder}/${filename}_temp.jpg`;

  try{
    //1. temp1 ??????
    // fs.writeFile(root, img, 'base64').then(e => {
    //   sharp(root).resize({width:1080, height:1600, position:'left top'})
    //   .toFile(root1).then(e => {
    //     fs.rename.rename(root1, root3).then(e => {
    //       fs.unlink(root);
    //     })
    //   })
    // });

    sharp.cache(false);

    const buf = Buffer.from(img, 'base64');

    if(mobileYn !== 'Y'){
      const result1 = await fsPromises.writeFile(root, buf, 'base64');
      const result2 = await sharp(root).resize({width:1080, height:1650, position:'left top'}).toFile(root1);
      const result3 = await fsPromises.rename(root1, root3);
      const result4 = await fsPromises.unlink(root);
    }else{
      const result1 = await fsPromises.writeFile(root3, buf, 'base64');
      // const result2 = await fsPromises.unlink(root4);
    }




    // fs.writeFile(root, buf, 'base64', (err) => {
    //   if(err){
    //     return 'N';
    //   }else{
    //     sharp(root).resize({width:1080, height:1650, position:'left top'}).toFile(root1).then(e => {
    //       fs.rename(root1, root3, (err) => {
    //         if(err){
    //           return 'N';
    //         }else{
    //           fs.unlink(root, (err) => {
    //             if(err){
    //               return 'N';
    //             }else{
    //               return 'Y';
    //             }
    //           })
    //         }
    //       })
    //     })
    //   }
    // })
  
  
    // await fsPromises.rename(root1, root3);
    // fsPromises.unlink(root);

    // await sleep(200);

    // //?????? ????????? ???????????? ???????????? ??????.
    // //3. temp3?????? ??????
    // await sharp(root1).png({
    //   palette: true,
    //   quality: 100,
    //   progressive: true
    // }).resize({fit:'fill', width:1080, height:1825})
    //   .toFile(root2);
  
    // await sleep(200);

    // await fsPromises.rename(root2, root3);
    // fsPromises.unlink(root);
    // fsPromises.unlink(root1);
    
    return 'Y';
  }catch(e) {
    callLog('ScreenShot', `makeImg: ${e}`);
    return e;
  }
}

const makeImgMobile = async(img, folder, filename) => {

  const root = `F:/IMS/scaleChit/${folder}/${filename}`;

  try{

    //?????? ????????? ?????????????????? _TEMP????????? ???????????? ????????? ??????????????????.
    if(filename.indexOf('_TEMP') < 0){
      // console.log(img);
      
      //1. ????????????(?????????: ????????????_REAL.jpg)
      const buf = Buffer.from(img, 'base64');
      await fsPromises.writeFile(root.replace('.jpg', '_REAL.jpg'), buf);
      sharp.cache(false);
      sharp(root.replace('.jpg', '_REAL.jpg')).resize({width:1080, height:1650, position:'left top'}).toFile(root).then(e => {
        sharp.cache(false);

      })

      //2. ?????????????????? ????????? ??????.
      await sharp(root.replace('.jpg', '_REAL.jpg')).resize({fit:'fill', width:1080, height:1825})
      .toFile(root);

      //4. ????????????
      // //replace?????? ?????? (???????????? ~~~.jpg??? ???????????? replace ~~~_TEMP
      // await delImg(folder, `${filename.replace('.jpg', '_REAL')}`);
      // await delImg(folder, `${filename.replace('.jpg', '_TEMP')}`);
    }else{
      //1. ????????? ?????????
      const buf = Buffer.from(img, 'base64');
      await fsPromises.writeFile(root.replace('_TEMP.jpg', '_TEMP_1.jpg'), buf);

      sharp.cache(false);
      //2. ?????????????????? ????????? ??????.
      await sharp(root.replace('_TEMP.jpg', '_TEMP_1.jpg')).resize({fit:'fill', width:1080, height:1825})
      .toFile(root);

      //3. _1?????? ??????
      await delImg(folder, `${filename.replace('_TEMP.jpg', '_TEMP_1')}`);
    }
    
    return 'Y';
  }catch(e) {
    callLog('ScreenShot', `makeImgMobile: ${e}`);
    return e;
  }
}

//#region ????????? ??????

router.post('/YK_SnapshotList', (req, res) => {
  const scaleNumb = req.body.scaleNumb;
  const folder = scaleNumb.substring(0, 8);
  const root = fs.readdirSync(`F:/IMS/Screenshot/${folder}/${scaleNumb}`);

  res.json(root);
})

router.post('/YK_Chit_List', async(req, res) => {
  const list = req.body.list;
  let Client = require('ssh2-sftp-client');
  let sftp = new Client();

  sftp.connect({
    host: '10.10.10.139',
    port: 22,
    username: 'ims',
    password: 'wjdqhykims'
  }).then((e) => {
    return sftp.list(`/data/apache-tomcat-9.0.10/webapps/TALLY/Images/scaleChit/${list}`);
  })
  .then(data => {
    return data;
  })
  .then((data) => {
    // console.log(data);
    res.json(data);
  })
  .then(() => {
    sftp.end();
  })
  .catch(err => {
    callLog('ScreenShot', `YK_Chit_List: ${err.message}`);
    console.error(err.message);
    res.json([]);
  });
}); 

router.post('/YK_Chit_DEL', (req, res) => {
  const filename = req.body.filename;
  const folder = filename.substring(0, 8);

  let Client = require('ssh2-sftp-client');
  let sftp = new Client();
  
  sftp.connect({
    host: '10.10.10.139',
    port: 22,
    username: 'ims',
    password: 'wjdqhykims'
  }).then((e) => {
    return sftp.list(`/data/apache-tomcat-9.0.10/webapps/TALLY/Images/scaleChit/${folder}`);
  })
  .then(data => {
    const copyList = data.filter(e => e.name.indexOf(`${filename}_`) >= 0);
    const from = `/data/apache-tomcat-9.0.10/webapps/TALLY/Images/scaleChit/${folder}/${filename}.jpg`;
    const to   = `/data/apache-tomcat-9.0.10/webapps/TALLY/Images/scaleChit/${folder}/${filename}_${copyList.length + 1}.jpg`;
    
    const root1 = `F:/IMS/scaleChit/${folder}/${filename}.jpg`;
    const root2 = `F:/IMS/scaleChit/${folder}/${filename}_${copyList.length + 1}.jpg`;
    fsPromises.rename(root1, root2);

    return sftp.rename(from, to);
  })
  .then((data) => {
    console.log(data);
    res.json(data);
  })
  .then(() => {
    sftp.end();
  })
  .catch(err => {
    callLog('ScreenShot', `YK_Chit_DEL: ${err.message}`);
    console.error(err.message);
  });



  // const root = fs.readdirSync(`F:/IMS/scaleChit/${folder}`);
  // const fileCnt = root.filter(e => e.toString().indexOf(`${filename}_`) >= 0);
  // console.log(`F:/IMS/scaleChit/${folder}/${filename}.jpg`)
  // console.log(`F:/IMS/scaleChit/${folder}/${filename}_${fileCnt.length + 1}.jpg`)
  // fsPromises.rename(`F:/IMS/scaleChit/${folder}/${filename}.jpg`, `F:/IMS/scaleChit/${folder}/${filename}_${fileCnt.length + 1}.jpg`);

  // res.json('Y');

  // // delImg(folder, filename).then(e => {
  // //   res.json(e);
  // // });
}); 

const delImg = async(folder, filename) => {
  const root = `F:/IMS/scaleChit/${folder}/${filename}.jpg`;
  try{
    await fsPromises.unlink(root);

    return 'Y';
  }catch(e){
    callLog('ScreenShot', `delImg: ${e}`);
    return e;
  }
}
//#endregion

//#endregion

const getToday = () => {
  var date = new Date();
  var year = date.getFullYear();
  var month = ('0' + (1 + date.getMonth())).slice(-2);
  var day = ('0' + date.getDate()).slice(-2);

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