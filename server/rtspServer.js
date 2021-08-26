const express = require('express');
const app3000 = express();
const cors = require('cors');

global.MILESTONE_RTSP = {};

app3000.use(express.json());
app3000.use(cors());  

const port3000 = 3000;
app3000.listen(port3000, function(){
  console.log(`RTSP on port: ${port3000}..`)
});

app3000.post('/RTSPStart', (req, res) => {
  
  try{
    const device = req.body.device;
   
    if(global.MILESTONE_RTSP[device] === undefined){
      const streamUrl = req.body.streamUrl;
      const port = req.body.port;
      
      // const streamUrl = 'rtsp://admin:pass@10.10.136.128:554/video1'; //트루엔
      // const streamUrl = 'rtsp://admin:admin13579@10.10.136.112:554/profile2/media.smp'; //한화
    
      const Stream = require('node-rtsp-stream');
      const streams = new Stream({
        name: device, 
        streamUrl: streamUrl,
        wsPort: port, //3100, 
        width: 1920,  
        height: 1080 
      });            
      
      global.MILESTONE_RTSP[device] = streams;
    }   
     
    res.json('OK') ;
  }catch(e){
    res.json(e) ; 
  }
});

app3000.post('/RTSPStop', (req, res) => {
  try{
    const device = req.body.device;
    global.MILESTONE_RTSP[device] = undefined;
     
    res.json('OK') ;   
  }catch (e){
    res.json(e) ; 
  }
});  