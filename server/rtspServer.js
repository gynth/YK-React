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

app3000.post('/RTSPStart', (req, res) => {
  
  try{
    // if(global.MILESTONE_RTSP[device] === undefined){
      const device = req.body.device;
      const streamUrl = req.body.streamUrl;
      const port = req.body.port;
      
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

      new Stream({
        name : device,
        streamUrl,
        wsPort: port, //3100, 
        width: 1920,  
        height: 1080,
        interval: null
      });          
      
    //   global.MILESTONE_RTSP[device] = streams;
    // }
     
    res.json('OK') ;
  }catch(e){
    res.json(e) ; 
  }
});

app3000.post('/RTSPStop', (req, res) => {
  try{
    const device = req.body.device;
    const port   = req.body.port;
    global.MILESTONE_RTSP[device].port = global.MILESTONE_RTSP[device].port.filter(e => {
      if(e === port) return false;
      else return true;
    })

    console.log(global.MILESTONE_RTSP[device]);
     
    res.json('OK') ;   
  }catch (e){
    res.json(e) ; 
  }
});  