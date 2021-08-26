const express = require('express');
const router = express.Router();
const fs = require('fs');
const fsPromises = fs.promises;
const soap = require('soap'); 
const sharp = require('sharp');

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

// //#region 출발보고 불러오기
// router.post('/YK_Disp_YN', (req, res) => {
//   const fileName = req.body.fileName; 
//   const scrp_ord_no = req.body.scrp_ord_no;
//   const folder = scaleNo.substring(0, 8);

//   if(fs.existsSync(`F:\\IMS\\Disp\\${folder}\\${fileName}`)){
//     const readFile = fs.readFileSync(`F:\\IMS\\Disp\\${folder}\\${fileName}`);
//     const encode = Buffer.from(readFile).toString('base64');
//     res.end(encode);
//   }else{
//     res.json('N');
//   }
// });  
// //#endregion

//#region 계량표 저장
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
  
    await sharp(root).extract({left:16, top:0, width:336, height:690})    
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

const sleep = (ms) => {
  return new Promise(resolve=>setTimeout(resolve, ms));
}

//#endregion

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