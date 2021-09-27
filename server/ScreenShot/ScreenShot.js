const express = require('express');
const router = express.Router();
const fs = require('fs');
const fsPromises = fs.promises;
const soap = require('soap'); 
const sharp = require('sharp');

router.post('/Milestone', (req, res) => {
  let device = req.body.device;
  let scaleNo = req.body.scaleNo;

  // if(!fs.existsSync(`${__dirname}/Screenshot`)){
  //   fs.mkdirSync(`${__dirname}/Screenshot`);
  // }
  if(!fs.existsSync(`F:\\IMS`)){
    fs.mkdirSync(`F:\\IMS`);
  }
  if(!fs.existsSync(`F:\\IMS\\Screenshot`)){
    fs.mkdirSync(`F:\\IMS\\Screenshot`);
  }

  const root = `F:\\IMS\\Screenshot/${scaleNo}`;
  // const root = `C:\\IMS\\Screenshot\\${scaleNo}`;

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
        const filename = `${getCurrentDate()}.png`;
        fs.writeFile(`${root}\\${filename}`, img, 'base64', function(err) {
          if(err === null){
            res.json({Result: 'OK'})
          }else{
            res.json({Result: err});
          }
        }); 
      }else {
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

  fs.writeFile(`${root}\\${filename}`, img, 'base64', function(err) {
    res.json(err);
  });
});

//#region 계량표 불러오기
router.post('/YK_Chit_YN', (req, res) => {
  const scaleNo = req.body.scaleNo;
  const folder = scaleNo.substring(0, 8);

  if(fs.existsSync(`F:\\IMS\\Chit\\${folder}\\${scaleNo}.jpg`)){
    const readFile = fs.readFileSync(`F:\\IMS\\Chit\\${folder}\\${scaleNo}.jpg`);
    const encode = Buffer.from(readFile).toString('base64');
    res.end(encode);
  }else{
    res.json('N');
  }
});   

//#endregion

//#region 계량표 파일여부
router.post('/YK_Chit_file_yn', (req, res) => {
  const filename = req.body.filename;
  const folder = filename.substring(0, 8);

  if(!fs.existsSync(`F:\\IMS\\Chit\\${folder}\\${filename}`)){
    res.json('N');
  }else{
    res.json('Y');
  }
})
//#endregion

//#region 계량표 저장
router.post('/YK_Chit_Mobile', (req, res) => {
  
  const img = req.body.img.replace('data:image/png;base64,', '');
  const filename = req.body.filename;
  const folder = filename.substring(0, 8);
  
  if(!fs.existsSync(`F:\\IMS`)){
    fs.mkdirSync(`F:\\IMS`);
  }
  if(!fs.existsSync(`F:\\IMS\\Chit`)){
    fs.mkdirSync(`F:\\IMS\\Chit`);
  }
  if(!fs.existsSync(`F:\\IMS\\Chit\\${folder}`)){
    fs.mkdirSync(`F:\\IMS\\Chit\\${folder}`);
  }

  if(!fs.existsSync(`F:\\IMS\\Chit\\${folder}\\${filename}`)){
    makeImgMobile(img, folder, filename).then(e => {
      res.json(e);
    });
  }else{
    res.json('OK');
  }
})

router.post('/YK_Chit', (req, res) => {

  const img = req.body.img.replace('data:image/png;base64,', '');
  const filename = req.body.filename;
  const folder = filename.substring(0, 8);
  
  if(!fs.existsSync(`F:\\IMS`)){
    fs.mkdirSync(`F:\\IMS`);
  }
  if(!fs.existsSync(`F:\\IMS\\Chit`)){
    fs.mkdirSync(`F:\\IMS\\Chit`);
  }
  if(!fs.existsSync(`F:\\IMS\\Chit\\${folder}`)){
    fs.mkdirSync(`F:\\IMS\\Chit\\${folder}`);
  }

  // const root4 = `F:\\Project\\01.YK\\Screenshot\\20210805\\test.png`;
  // const root5 = `F:\\Project\\01.YK\\Screenshot\\20210805\\test2.png`;
  makeImg(img, folder, filename).then(e => {
    res.json(e);
  });
}); 

const makeImg = async(img, folder, filename) => {

  const root = `F:\\IMS\\Chit\\${folder}\\${filename}_temp1.png`;
  const root1 = `F:\\IMS\\Chit\\${folder}\\${filename}_temp2.png`;
  const root2 = `F:\\IMS\\Chit\\${folder}\\${filename}_temp3.png`;
  const root3 = `F:\\IMS\\Chit\\${folder}\\${filename}.jpg`;

  try{
    await fsPromises.writeFile(root, img, 'base64');
  
    await sleep(300);
  
    await sharp(root).extract({left:16, top:0, width:336, height:548})    
    .toFile(root1);
   
    await sleep(300);

    // //원본 비율을 무시하고 리사이즈 한다.
    // await sharp(root1).resize({fit:'fill', width:540, height:942})
    // .toFile(root2);
  
    // await sleep(300);

    await fsPromises.rename(root1, root3);
  
    await sleep(300);

    await fsPromises.unlink(root);

    // await sleep(300);

    // await fsPromises.unlink(root1);
  



    // //원본 비율을 무시하고 리사이즈 한다.
    // await sharp(root1).resize({fit:'fill', width:540, height:942})
    // .toFile(root2);
  
    // await sleep(300);

    // await fsPromises.rename(root2, root3);
  
    // await sleep(300);

    // await fsPromises.unlink(root);

    // await sleep(300);

    // await fsPromises.unlink(root1);
    
    return 'Y';
  }catch(e) {
    return e;
  }
}

const makeImgMobile = async(img, folder, filename) => {

  const root = `F:\\IMS\\Chit\\${folder}\\${filename}`;

  try{

    //실제 계량표 이미지인경우 _TEMP파일을 삭제하고 상단의 여백처리한다.
    if(filename.indexOf('_TEMP') < 0){

      
      //1. 파일생성(파일명: 계량번호_REAL.jpg)
      const buf = Buffer.from(img, 'base64');
      await fsPromises.writeFile(root.replace('.jpg', '_REAL.jpg'), buf);

      //2. 기준사이즈로 재생성 한다.
      await sharp(root.replace('.jpg', '_REAL.jpg')).resize({fit:'fill', width:1080, height:1825})
      .toFile(root);

      // //3. 파일재생성. 상단 자르기
      // await sharp(root.replace('.jpg', '_REAL_1.jpg')).extract({left:0, top:200, width:1080, height:1625})    //1855
      // .toFile(root);

      //4. 파일삭제
      // //replace하는 이유 (파일명이 ~~~.jpg로 들어와서 replace ~~~_TEMP
      await delImg(folder, `${filename.replace('.jpg', '_REAL')}`);
      // await delImg(folder, `${filename.replace('.jpg', '_REAL_1')}`);
      await delImg(folder, `${filename.replace('.jpg', '_TEMP')}`);





      
      // //1. 파일생성(파일명: 계량번호_REAL.jpg)
      // const buf = Buffer.from(img, 'base64');
      // await fsPromises.writeFile(root.replace('.jpg', '_REAL.jpg'), buf);

      // //2. 기준사이즈로 재생성 한다.
      // await sharp(root.replace('.jpg', '_REAL.jpg')).resize({fit:'fill', width:1080, height:1825})
      // .toFile(root.replace('.jpg', '_REAL_1.jpg'));

      // //3. 파일재생성. 상단 자르기
      // await sharp(root.replace('.jpg', '_REAL_1.jpg')).extract({left:0, top:200, width:1080, height:1625})    //1855
      // .toFile(root);

      // //4. 파일삭제
      // //replace하는 이유 (파일명이 ~~~.jpg로 들어와서 replace ~~~_TEMP
      // await delImg(folder, `${filename.replace('.jpg', '_REAL')}`);
      // await delImg(folder, `${filename.replace('.jpg', '_REAL_1')}`);
      // await delImg(folder, `${filename.replace('.jpg', '_TEMP')}`);
    }else{
      //1. 계량표 생성후
      const buf = Buffer.from(img, 'base64');
      await fsPromises.writeFile(root.replace('_TEMP.jpg', '_TEMP_1.jpg'), buf);

      //2. 기준사이즈로 재생성 한다.
      await sharp(root.replace('_TEMP.jpg', '_TEMP_1.jpg')).resize({fit:'fill', width:1080, height:1825})
      .toFile(root);

      //3. _1파일 삭제
      await delImg(folder, `${filename.replace('_TEMP.jpg', '_TEMP_1')}`);
    }
    
    return 'Y';
  }catch(e) {
    return e;
  }
}

//#region 계량표 삭제

router.post('/YK_Chit_DEL', (req, res) => {
  const filename = req.body.filename;
  const folder = filename.substring(0, 8);

  delImg(folder, filename).then(e => {
    res.json(e);
  });
}); 

const delImg = async(folder, filename) => {
  const root = `F:\\IMS\\Chit\\${folder}\\${filename}.jpg`;
  try{
    await fsPromises.unlink(root);

    return 'Y';
  }catch(e){
    return e;
  }
}
//#endregion

const sleep = (ms) => {
  return new Promise(resolve=>setTimeout(resolve, ms));
}

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