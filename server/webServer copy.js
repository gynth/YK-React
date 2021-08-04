const express = require('express');
const app3001 = express();
const app3002 = express();
const Mysql = require('./db/Mysql/Mysql');
const Milestone = require('./Milestone/Milestone');
const WebReq = require('./WebReq/WebReq');
const ScreenShot = require('./ScreenShot/ScreenShot');
const cors = require('cors');
var edge = require('edge-js');
// const soap = require('soap'); 

global.MILESTONE_IP = '211.231.136.182';
global.MILESTONE_TOKEN = '';
global.MILESTONE_DEVICE = {};
global.MILESTONE_TOKEN_TIME = '';
global.MILESTONE_DATA = {};

// var httpAttach = require('http-attach') // useful module for attaching middlewares
// const fs = require('fs');
// const hls = require('hls-server');

// var http = require('http');
// var url = require('url');

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

//#region Mysql요청
app3001.use('/Mysql', Mysql);
//#endregion

//#region YK스틸 웹요청
app3001.use('/YK', WebReq);
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




const Stream = require('node-rtsp-stream');
// const streamUrl = "rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov";
const streamUrl = 'rtsp://admin:pass@10.10.136.128:554/video1';

const streams = new Stream({
  name: 'primary', 
  streamUrl: streamUrl,
  wsPort: 3100,
  width: 1024,
  height: 768,
  analyzeduration: 2147483647,
  probesize: 2147483647
  // ffmpegOptions: { // options ffmpeg flags
  //   '-stats': '', // an option with no neccessary value uses a blank string
  //   '-r': 30, // options with required values specify the value after the key
  //   'video': 'h264'
  // }
});  

  
 






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


 

// app.use('/Socket', () => {
//   try{
//     console.log(111);
//     var net = require('net');
//     var socket = new net.Socket();
//     socket.connect({host:'10.0.10.155', port:7563}, function() {
//        console.log('서버와 연결 성공');
    
//        socket.write('Hello Socket Server\n');
//        socket.end(); 
    
//         socket.on('data', function(chunk) {
//             console.log('서버가 보냄 : ',
//             chunk.toString());        
//         }); 
    
//         socket.on('end', function() {
//             console.log('서버 연결 종료');
//         });
//     });
//   }catch (e){
//     console.log(e)
//   }
// })





// var server = http.createServer(function(request,response){

//   var parsedUrl = url.parse(request.url);
//   var resource = parsedUrl.pathname;
//   // console.log('resource='+resource);

//   // var resourcePath = '.'+resource;
//   var resourcePath = __dirname + request.url;
//   // console.log('resourcePath='+resourcePath);

//   // html 페이지 요청이 들어왔을 경우는 텍스트 파일 처리
//   // if(resource.indexOf('/html/') === 0){
//   //   fs.readFile(resourcePath, 'utf-8', function(error, data) {
//   //     if(error){
//   //       response.writeHead(500, {'Content-Type':'text/html'});
//   //       response.end('500 Internal Server '+error);
//   //     }else{
//   //       response.writeHead(200, {'Content-Type':'text/html'});
//   //       response.end(data);
//   //     }
//   //   }); 
 
//   // }else if(resource.indexOf('/movie/') === 0){
//     // 1. stream 생성 
//     var stream = fs.createReadStream(resourcePath);
//     stream.on('data', (video) => {
//       response.write(video); 
//     })
//     stream.on('end', (endData) => { console.log('end streaming -->'); response.end(); });

//     // // 2. 잘게 쪼개진 stream 이 몇번 전송되는지 확인하기 위한 count
//     // var count = 0;
//     // // 3. 잘게 쪼개진 data를 전송할 수 있으면 data 이벤트 발생 
//     // stream.on('data', function(data) {
//     //   count = count + 1;
//     //   console.log('data count='+count);
//     //   // 3.1. data 이벤트가 발생되면 해당 data를 클라이언트로 전송
//     //   response.write(data);
//     // });

//     // // 4. 데이터 전송이 완료되면 end 이벤트 발생
//     // stream.on('end', function () {
//     //   console.log('end streaming');
//     //   // 4.1. 클라이언트에 전송완료를 알림
//     //   response.end();
//     // });

//     // // 5. 스트림도중 에러 발생시 error 이벤트 발생
//     // stream.on('error', function(err) {
//     //   console.log(err);
//     //   // 5.2. 클라이언트로 에러메시지를 전달하고 전송완료
//     //   response.end('500 Internal Server '+err);
//     // });
//   // }else{
//   //   response.writeHead(404, {'Content-Type':'text/html'});
//   //   response.end('404 Page Not Found');
//   // }
// });

// server.listen(3002, function(){
//   console.log('Server is running...');
// });
// function yourMiddleware (req, res, next) {
//   // set your headers here
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   next()
// } 
// httpAttach(server, yourMiddleware)














// app.get('/Stream',  (req, res) => {
//   return res.status(200).sendFile(`${__dirname}/index.html`);
// });

// const server = app.listen(3002);
// new hls(server, {
//   provider: {
//     exists: (req, cb) => {
//       const ext = req.url.split('.').pop();

//       // if(ext !== 'm3u8' && ext !== 'ts'){
//       //   return cb(null, true);
//       // }

//       fs.access(__dirname + req.url, fs.constants.F_OK, (err) => {
//         if(err){
//           console.log('file not exists');
//           return cb(null, false);
//         }  
//         cb(null, true); 
//       });
//     },
//     getManifestStream: (req, cb) => {
//       console.log('1');
//       const stream = fs.createReadStream(__dirname + req.url);
//       cb(null, stream);
//     },
//     getSegmentStream: (req, cb) => {
//       const stream = fs.createReadStream(__dirname + req.url);
//       cb(null, stream);
//     }
//   }    
// })  
// function yourMiddleware (req, res, next) {
//   // set your headers here
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   next() 
// }
// httpAttach(server, yourMiddleware)