const express = require('express');
const router = express.Router();
const soap = require('soap'); 
var edge = require('edge-js');

//object[] info
//0: token
//1: device
//2: call
//3: PTZ flag(up, down.....)
//4: Scale No. 배차번호
//5: Rec Owner - '0':자동녹화, '1':수동녹화

//#region JPEGGetLive
router.post('/JPEGGetLive', (req, res) => {
  try{
    const MilestoneIP = req.body.MilestoneIP;
    const token = req.body.token;
    const deviceId = req.body.deviceId;

    var url = `http://${MilestoneIP}:7563/RecorderCommandService/RecorderCommandService.asmx?wsdl`;
    soap.createClient(url, (err, client) => {

      client.JPEGGetLive({token, deviceId, maxWidth:1280, maxHeight:1024}, (e, r) => {
        // var base64EncodedStr = btoa(unescape(encodeURIComponent(r)));
        // console.log(base64EncodedStr);

        // console.log(a)
        const img = r.JPEGGetLiveResult.Data;
        if(e === null) res.json({JPEG: `data:image/JPEG;base64,${img}`})
        else res.json({JPEG: ''});
      }) 
    })
  }catch(e){
    res.json({JPEG: ''})
  }
})
//#endregion

router.post('/RTSPStart', (req, res) => {
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
});    

router.post('/RTSPStop', (req, res) => {
  const device = req.body.device;
  global.MILESTONE_RTSP[device] = undefined;
   
  res.json('OK') ;   
});  
  
router.post('/CONNECT', (req, res) => {
  const device = req.body.device;

  // 1-1. 설정된 데이터가 없을때만 진행한다.
  if(global.MILESTONE_DATA[device] === undefined){
    let Connect = edge.func({
      assemblyFile:`${__dirname}/Milestone.dll`,
      methodName: 'Connect'
    });
 
    // global.MILESTONE_DATA[device] = {
    //   method : Connect
    // }


    Connect([global.MILESTONE_TOKEN, device, 'Start', '', ''], (error, result) => { 
      console.log(result[1]);
      if(result[1] === 'Y') {
        global.MILESTONE_DATA[device] = {
          method : Connect
        }
      }
    })

    Connect([global.MILESTONE_TOKEN, device, 'Start', '', ''], (error, result) => { 
      if(result[1] === 'Y') {
        global.MILESTONE_DATA[device] = {
          method : Connect,
          nodeLoop: setInterval(() => {
                      global.MILESTONE_DATA[device].method([global.MILESTONE_TOKEN, device, 'Live', '', ''], (error, result) => { 
                        if(result[1] === 'Y') {
                          global.MILESTONE_DATA[device].liveImg = result[2];
                        }
                      })   
                    }, 1)
        }
      }
    })
  }   
    
  res.json({result:'OK'}) 
});  

router.post('/Replay', (req, res) => { 
  const device = req.body.device;
  const scaleNo = req.body.scaleNo;
  const cameraName = req.body.cameraName; 

  //설정된 메서드가 없으면 생성.
  if(global.MILESTONE_REPLAY === undefined){
    let Connect = edge.func({
      assemblyFile:`${__dirname}/Milestone.dll`,
      methodName: 'Connect'
    });
     
    Connect([global.MILESTONE_TOKEN, device, 'Start', '', scaleNo, '', cameraName], (error, result) => { 
      if(result[1] === 'Y') {
        global.MILESTONE_REPLAY = Connect;
      }
    })  
  } 
 
  global.MILESTONE_REPLAY([global.MILESTONE_TOKEN, device, 'Replay', '', scaleNo, '', cameraName], (error, result) => { 
    
    console.log(result); 

    if(error === undefined) res.json('OK');
    else res.json(error)
  })   
}); 
  

router.post('/PTZ', (req, res) => {
  const device = req.body.device;
  const ptz = req.body.ptz; 

  //설정된 메서드가 있을때만 진행한다.
  if(global.MILESTONE_DATA[device] !== undefined){
    global.MILESTONE_DATA[device].method([global.MILESTONE_TOKEN, device, 'PTZ', ptz, ''], (error, result) => { 
      if(error === undefined) res.json('OK');
      else res.json(error)
    })   
  }
});

router.post('/StartManualRecording', (req, res) => {
  const device = req.body.device;
  const scaleNo = req.body.scaleNo; 
  const recOwner = req.body.recOwner;

  //설정된 메서드가 있을때만 진행한다.
  if(global.MILESTONE_DATA[device] !== undefined){
    global.MILESTONE_DATA[device].method([global.MILESTONE_TOKEN, device, 'StartManualRecording', '', scaleNo, recOwner], (error, result) => { 
      if(error === undefined) res.json('OK');
      else res.json(error);
    })   
  }
});

router.post('/StopManualRecording', (req, res) => {
  const device = req.body.device;
  const scaleNo = req.body.scaleNo; 

  //설정된 메서드가 있을때만 진행한다.
  if(global.MILESTONE_DATA[device] !== undefined){
    global.MILESTONE_DATA[device].method([global.MILESTONE_TOKEN, device, 'StopManualRecording', '', scaleNo, ''], (error, result) => { 
      if(error === undefined) res.json('OK');
      else res.json(error);
    })   
  }
});

//#region 마일스톤 카메라 상태 가져오기
router.post('/Status', (req, res) => {
  const device = req.body.device;
  
  if(global.MILESTONE_DATA[device] !== undefined){
    global.MILESTONE_DATA[device].method([global.MILESTONE_TOKEN, device, 'Status', '', '', ''], (error, result) => { 
      const scaleNo = result[0];
      const recYn = result[1];
      const recDt = result[2];

      res.json({scaleNo, recYn, recDt});
    })   
  }
})
//#endregion
  
//#region 마일스톤 라이브 이미지 가져오기
router.get('/LIVE', (req, res) => {
  const device = req.query.device;

  if(global.MILESTONE_DATA[device] !== undefined){
    res.json(global.MILESTONE_DATA[device].liveImg); 
    
    // res.json({liveImg: global.MILESTONE_DATA[device].liveImg,
    //   recYn  : global.MILESTONE_DATA[device].recYn,
    //   recDt  : global.MILESTONE_DATA[device].recDt}); 
  } 
  else 
    res.json('')   
})     
    
router.post('/LIVE', (req, res) => {
  const device = req.body.device;


  if(global.MILESTONE_DATA[device] !== undefined){
    res.json(global.MILESTONE_DATA[device].liveImg); 
    // res.send()
  } 
  else 
    res.json('')   
})  
//#endregion

//#region 마일스톤 로그인
router.post('/LOGIN', (req, res) => {
  
  try{
    const MilestoneIP = req.body.MilestoneIP;

    var getToken = edge.func({
      assemblyFile:`${__dirname}/Milestone.dll`,
      methodName: 'getToken'
    });
 
    let loginResult;
    getToken([MilestoneIP], (error, result) => {
      loginResult = result;
    })      
 
    if(loginResult !== undefined){ 
      var getCamera = edge.func({
        assemblyFile:`${__dirname}/Milestone.dll`,
        methodName: 'getCamera'
      }); 

      let deviceResult;
      getCamera([MilestoneIP, loginResult[1]], (error, result) => {
        deviceResult = result;
      }) 
      const token = loginResult;
      const deviceId = deviceResult;
      console.log(token, deviceId); 
      
      if(deviceResult !== undefined){
        res.json({token, deviceId});
      }else{
        res.json({token:'', deviceId: ''})
      }
    }else{
      res.json({token:'', deviceId: ''})
    }
  }catch(err){
    res.json({token:'', deviceId: '', err})
  }
});
//#endregion

module.exports = router; 