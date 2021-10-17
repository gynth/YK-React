const express = require('express');
const app3001 = express();
const app3002 = express();
const Oracle = require('./db/Oracle/Oracle');
const Mysql = require('./db/Mysql/Mysql')
const Milestone = require('./Milestone/Milestone');
const WebReq = require('./WebReq/WebReq');
const ScreenShot = require('./ScreenShot/ScreenShot');
const cors = require('cors');
var edge = require('edge-js');
const fs = require('fs');

// const soap = require('soap'); 

global.MILESTONE_IP = '10.10.10.136';
global.MILESTONE_TOKEN = '';
global.MILESTONE_DEVICE = {};
global.MILESTONE_TOKEN_TIME = '';
global.MILESTONE_DATA = {};
global.REC_SCALENUMB = null;
global.RAIN = 0;

app3001.use(express.json({
  limit: '100mb'
}));
app3001.use(express.urlencoded({ 
  limit: '100mb',
  extended: false 
})); 
app3002.use(express.json({ 
  limit: '100mb'
}));
app3002.use(express.urlencoded({
  limit: '100mb',
  extended: false
}));
app3001.use(cors());  
app3002.use(cors());

// app3001.use('/Ai', Ai);

//#region YK스틸 웹요청
app3001.use('/YK', WebReq);
//#endregion 
 
//#region 오라클
app3001.use('/Oracle', Oracle);
//#endregion
 
//#region Mysql
app3001.use('/Mysql', Mysql);
//#endregion

//#region 화면캡쳐
app3001.use('/ScreenShot', ScreenShot);
//#endregion 

//#region MileStone
app3002.use('/Milestone', Milestone);
//#endregion 

//#region 서버시작
const port3001 = 3001;
app3001.listen(port3001, () => {
  console.log(`WebServer on port: ${port3001}..`)
});  

const port3002 = 3002;
app3002.listen(port3002, () => {
  //서버시작하면 global에 마일스톤 토큰과 디바이스를 세팅한다.
  //카메라가 추가되면 서버 재시작 해야함.
  console.log(`MileStoneServer on port: ${port3002}..`)
  refreshToken();
});  
//#endregion
      
//#region  마일스톤 토큰 처리
const getToken = () => {
  try{
    var getToken = edge.func({
      assemblyFile:`${__dirname}/Milestone/Milestone.dll`,
      methodName: 'getToken'
    });

    let loginResult; 
    getToken([global.MILESTONE_IP], (error, result) => {
      loginResult = result;
    })   

    if(loginResult !== undefined){
      var getCamera = edge.func({
        assemblyFile:`${__dirname}/Milestone/Milestone.dll`,
        methodName: 'getCamera'
      });

      let deviceResult;
      getCamera([global.MILESTONE_IP, loginResult[1]], (error, result) => {
        deviceResult = result;
      }) 
      const token = loginResult;
      const deviceId = deviceResult;
      
      if(deviceResult !== undefined){
        
        let now = new Date();
        let baseTm = new Date(`2000-01-01 ${token[2]}`);
        let hour = baseTm.getHours();
        let min  = baseTm.getMinutes();
        let sec  = baseTm.getSeconds();
    
        // 시간 더하기
        now.setHours(now.getHours() + hour);
        // 분 더하기
        now.setMinutes(now.getMinutes() + min);
        // 초 더하기
        now.setSeconds(now.getSeconds() + sec);
        // 10분 빼기
        now.setMinutes(now.getMinutes() - 10);
        
        global.MILESTONE_TOKEN  = token[1];
        global.MILESTONE_TOKEN_TIME = now;
        global.MILESTONE_DEVICE = deviceId; 
      }else{
        global.MILESTONE_TOKEN  = '';
        global.MILESTONE_DEVICE = '';
      }
    }else{
      global.MILESTONE_TOKEN  = '';
      global.MILESTONE_DEVICE = '';
    }
  }catch(err){
    global.MILESTONE_TOKEN  = '';
    global.MILESTONE_DEVICE = '';
  }
}

const refreshToken = () => {
  setInterval((e) => {
    //1초마다 타이머 돌면서 토큰을 갱신한다.
    //현재설정은 3시간50분기준

    const chkNow = new Date().valueOf();
    const tokenTime = global.MILESTONE_TOKEN_TIME.valueOf();

    //현재시간이 토큰 만료시간 10분전이 넘어가면 토큰을 새로 발급한다.
    if(global.MILESTONE_TOKEN === ''){
      getToken();
    }
    else if(chkNow >= tokenTime){
      getToken();
    }
  }, 1000);
}

app3002.post('/Token', (req, res) => {
  res.json({TOKEN: global.MILESTONE_TOKEN, DEVICE: global.MILESTONE_DEVICE});
});
//#endregion




var http = require('http');
var chitImgServer = http.createServer();

chitImgServer.listen(3129, 'localhost', 100, () => {
  console.log('Mobile Chit Server: 3129')
})

chitImgServer.on('connection',
  function (socket) {
      console.log('클라이언트가 접속');
  }
);

chitImgServer.on('request',
    function (req, res) {
      const url = req.url.substr(2);

      // const folder1 = url.substring(0, url.indexOf('/'));
      // const folder2 = url.substring(url.indexOf('/'), url.indexOf('/') + 1 + 8);
      const file = url.substring(0, url.indexOf('.jpg') + 4);

      console.log(file)

      fs.readFile(`F:/IMS/${file}`,              //파일 읽기
        function (err, data)
        {
          if(err === null){
            //http의 헤더정보를 클라이언트쪽으로 출력
            //image/jpg : jpg 이미지 파일을 전송한다
            // write 로 보낼 내용을 입력
            res.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
            res.writeHead(200, { "Context-Type": "image/jpg" });//보낼 헤더를 만듬
            res.write(data);   //본문을 만들고
            res.end();  //클라이언트에게 응답을 전송한다
          }
        });
    }
);