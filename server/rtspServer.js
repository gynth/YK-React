const express = require('express');
const app3000 = express();
const cors = require('cors');
const Stream = require('node-rtsp-stream');
// const Stream = require('rtsp-multi-stream');

global.MILESTONE_RTSP = {};

app3000.use(express.json());
app3000.use(cors());  

const port3000 = 3000;
app3000.listen(port3000, function(){
  console.log(`RTSP on port: ${port3000}..`)
});

app3000.post('/getEmptyPort', (req, res) => {
  const device = req.body.device;
  const MAX_CONNECTION = req.body.MAX_CONNECTION;
  const START_PORT = req.body.START_PORT;

  if(global.MILESTONE_RTSP[device] === undefined){
    global.MILESTONE_RTSP[device] = {port: []};
    global.MILESTONE_RTSP[device].port.push(START_PORT)

    res.json({'port': START_PORT});
  }else{
    if(global.MILESTONE_RTSP[device].port.length === MAX_CONNECTION){
      res.json({'port': 'Connection Full'});
    }else{
      for(let i = START_PORT; i <= (START_PORT + MAX_CONNECTION); i++){
        if(global.MILESTONE_RTSP[device].port.indexOf(i, 0) === -1){
          global.MILESTONE_RTSP[device].port.push(i);
          res.json({'port': i});
          return;
        }
      }
    }
  }
})

app3000.post('/WebSocket', (req, res) => {
  // const wsModule = require('ws');
  const port = req.body.port;

  var WebSocketClient = require('websocket').client;
  var client = new WebSocketClient();
  client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
  });
  
  client.on('connect', (con) => {
    res.send(
      client
    );

    // con.on('message', function(message) {
    //   res.json({message});
    // });
    // res.send({client: con});
  })

  // res.send({client});

  // client.on('connect', function(connection) {
  //   console.log('WebSocket Client Connected');
  //   connection.on('error', function(error) {
  //       console.log("Connection Error: " + error.toString());
  //   });
  //   connection.on('close', function() {
  //       console.log('echo-protocol Connection Closed');
  //   });
  //   connection.on('message', function(message) {
  //       if (message.type === 'utf8') {
  //           console.log("Received: '" + message.utf8Data + "'");
  //       }
  //   });

  //   res.json('OK');
  // });

  // client.connect(`ws://localhost:${port}/`, 'echo-protocol');
  client.connect(`ws://10.10.10.136:${port}/`);

  
  // const WebSocket = req.body.client;
  // const canvas = req.body.canvas;

  // const client = new WebSocket(`ws://10.10.10.136:${port}`)
  // res.json('OK');
})

app3000.post('/RTSPStart', (req, res) => {
  
  try{
    const device = req.body.device;
    const streamUrl = req.body.streamUrl;
    const port = req.body.port;
    const width = req.body.width;
    const height = req.body.height;
    const fps = req.body.fps;
    const bv = req.body.bv;
    const ba = req.body.ba;
    
    // const streamUrl = 'rtsp://admin:pass@10.10.136.128:554/video1'; //트루엔
    // const streamUrl = 'rtsp://admin:admin13579@10.10.136.112:554/profile2/media.smp'; //한화
  
    // const streams = new Stream({
    //   name: device, 
    //   streamUrl: streamUrl,
    //   wsPort: port, //3100, 
    //   width: 1920,  
    //   height: 1080,
    //   interval: null
    // });            

    if(global.MILESTONE_RTSP[device] === undefined){
      new Stream({
        name : device,
        streamUrl,
        wsPort: port, //3100, 
        // width: 1920,  
        // height: 1080,
        width,
        height,
        interval: null,
        ffmpegOptions: { // options ffmpeg flags
          '-stats': '',
          '-r': fps,
          //'-b:v', '4000k',
          //'-maxrate', '4000k',
          //'-bufsize', '4000k',
        }
      });          
      
      global.MILESTONE_RTSP[device] = 'Y';
    }
     
    res.json('OK') ;
  }catch(e){
    res.json(e) ; 
  }
});

app3000.post('/RTSPStop', (req, res) => {
  try{
    const device = req.body.device;
    const port   = req.body.port;
    // global.MILESTONE_RTSP[device].port = global.MILESTONE_RTSP[device].port.filter(e => {
    //   if(e === port) return false;
    //   else return true;
    // })

    global.MILESTONE_RTSP[device] = undefined;

    // console.log(global.MILESTONE_RTSP[device]);
     
    res.json('OK') ;   
  }catch (e){
    res.json(e) ; 
  }
});  