const express = require('express');
const router = express.Router();
const soap = require('soap'); 
var edge = require('edge-js');


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

router.post('/CONNECT', (req, res) => {
  const device = req.body.device;

  // 1-1. 설정된 데이터가 없을때만 진행한다.
  if(global.MILESTONE_DATA[device] === undefined){
    let Connect = edge.func({
      assemblyFile:`${__dirname}/Milestone.dll`,
      methodName: 'Connect'
    });

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

router.post('/PTZ', (req, res) => {
  const device = req.body.device;
  const ptz = req.body.ptz; 

  // 1-1. 설정된 데이터가 없을때만 진행한다.
  if(global.MILESTONE_DATA[device] !== undefined){
    global.MILESTONE_DATA[device].method([global.MILESTONE_TOKEN, device, 'PTZ', ptz, ''], (error, result) => { 
      if(error === undefined) res.json('OK');
      else res.json(error)
    })   
  }
});
  
//#region 마일스톤 라이브 이미지 가져오기
router.get('/LIVE', (req, res) => {
  const device = req.query.device;

  if(global.MILESTONE_DATA[device] !== undefined){
    res.json(global.MILESTONE_DATA[device].liveImg); 
    // res.send()
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