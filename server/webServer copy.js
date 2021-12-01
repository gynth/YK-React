const express = require('express');
const app3001 = express();
const app3002 = express();
const Oracle = require('./db/Oracle/Oracle');
const Mysql = require('./db/Mysql/Mysql')
const WebReq = require('./WebReq/WebReq');
const ScreenShot = require('./ScreenShot/ScreenShot');
const FileUpload = require('./fileUpload');
const cors = require('cors');
var edge = require('edge-js');
const fs = require('fs');

const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');
const { combine, timestamp, printf } = winston.format;
const logDir = 'D:/IMS_LOG';

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

//#region YK스틸 웹요청 사용안하는데 혹시몰라 그냥둠
app3001.use('/YK', WebReq);
//#endregion 

//#region 공지사항 파일 업로드
app3001.use('/File', FileUpload);
 
//#region 오라클
app3001.use('/Oracle', Oracle);
//#endregion
 
//#region Mysql
app3001.use('/Mysql', Mysql);
//#endregion

//#region 화면캡쳐
app3001.use('/ScreenShot', ScreenShot);
//#endregion 

//#region 서버시작
const port3001 = 3001;
app3001.listen(port3001, () => {
  console.log(`WebServer on port: ${port3001}..`);
});  

const port3002 = 3002;
app3002.listen(port3002, () => {
  //서버시작하면 global에 마일스톤 토큰과 디바이스를 세팅한다.
  //카메라가 추가되면 서버 재시작 해야함.
  console.log(`MileStoneServer on port: ${port3002}..`)
});  
//#endregion


//#region Log
app3001.post('/Log', async(req, res) => {
  const folder = req.body.folder;
  const msg = req.body.msg;

  console.log('loggg')

  crtLog(folder, msg);

  res.json('OK');
});

const logFormat = printf(info => {
  return `${info.timestamp} ${info.level}: ${info.message}`;
});

const crtLog = (folder, msg) => {
  const logger = winston.createLogger({
    format: combine(
      timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      logFormat,
    ),
    transports: [
      // info 레벨 로그를 저장할 파일 설정
      new winstonDaily({
        level: 'info',
        datePattern: 'YYYY-MM-DD',
        dirname: logDir + `/${folder}`,
        filename: `%DATE%.log`,
        maxFiles: 30,  // 30일치 로그 파일 저장
        zippedArchive: true, 
      }),
      // // error 레벨 로그를 저장할 파일 설정
      // new winstonDaily({
      //   level: 'error',
      //   datePattern: 'YYYY-MM-DD',
      //   dirname: logDir + '/error',  // error.log 파일은 /logs/error 하위에 저장 
      //   filename: `%DATE%.error.log`,
      //   maxFiles: 30,
      //   zippedArchive: true,
      // }),
    ],
  });
  
  // Production 환경이 아닌 경우(dev 등) 
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),  // 색깔 넣어서 출력
        winston.format.simple(),  // `${info.level}: ${info.message} JSON.stringify({ ...rest })` 포맷으로 출력
      )
    }));
  }

  logger.info(msg);
}
//#endregion