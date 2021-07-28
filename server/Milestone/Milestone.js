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

    Connect([global.MILESTONE_TOKEN, device, 'Start', 'PTZ', 'REC_YN'], (error, result) => { 
      if(result[1] === 'Y') {
        global.MILESTONE_DATA[device] = {
          method : Connect,
          nodeLoop: setInterval(() => {
                      global.MILESTONE_DATA[device].method([global.MILESTONE_TOKEN, device, 'Live', 'PTZ', 'REC_YN'], (error, result) => { 
                        if(result[1] === 'Y') {
                          global.MILESTONE_DATA[device].liveImg = result[2];
                        }
                      })   
                    }, 1)
        }
      }
    })    

    // global.MILESTONE_DATA[device] = {
    //   liveImg: '1',
    //   rec    : null
    // }

    // global.MILESTONE_DATA[device].rec = setInterval((e) => {
    //   getLive([global.MILESTONE_TOKEN, device, Object.keys(global.MILESTONE_DATA).length], (error, result) => { 
    //     if(result[0] === 'Y') {
    //      global.MILESTONE_DATA[device].liveImg = result;
    //     }
    //   })   
    // }, 1)
  }
 
  // if(index < 0){ 
  //   let getLive = edge.func({
  //     assemblyFile:'./server/Milestone/Milestone.dll',
  //     methodName: 'Connect'
  //   });
  //   liveImg.push({device, ip, liveImg: ''}); 
  //   // console.log(liveImg.find(e => e.device === device))
  //   setInterval((e) => {
  //     // console.log(device);
  //     getLive([global.MILESTONE_TOKEN, device, liveImg.length], (error, result) => { 
  //       if(result[0] === 'Y') {
  //         liveImg.find(e => e.device === device)['liveImg'] = result;
  //       }
  //     })  
  //   }, 1);    
  // }
  
  res.json({result:'OK'}) 
})  
 
// let getLive = edge.func({
//   assemblyFile:'./server/Milestone/Milestone.dll',
//   methodName: 'Live' 
// });  
  
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

// router.get('/TEST', async function(req, res) {
//   const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
//   const ffmpeg = require('fluent-ffmpeg');
//   ffmpeg.setFfmpegPath(ffmpegPath);
//   var flag_args = ['omit_endlist', 'append_list'];
//   new ffmpeg('D:/Project/01. YK/react/server/Milestone/test.avi').addOptions([
//       '-vcodec libx264',
//       '-crf 23',
//       '-r 10',
//       '-fflags nobuffer',
//       '-c:v copy',
//       '-c:a copy',
//       '-b:v 60k',
//       '-maxrate 60k',
//       '-minrate 60k',
//       '-bufsize 60k',
//       '-pix_fmt yuv420p',
//       '-flags low_delay',
//       '-flags',
//       '-global_header',
//       '-probesize 5000',
//       '-hls_flags ' + flag_args.join('+'),
//       '-hls_playlist_type event',
//       '-hls_time 3', //분단된 ts파일들의 길이 지정(초 단위)
//       '-hls_list_size 6', //m3u8파일에 기록될 최대 ts파일 수
//       '-hls_wrap 10', //저장될 파일 갯수의 최대 갯수 해당 갯수를 넘으면 덮어 씌웁니다
//   ]).on('start', function(commandLine) {
//       console.log('Spawned FFmpeg with command: ' + commandLine);
//   }).on('codecData', function(data) {
//     console.log('11');
//       res.send({id:'test', url : 'D:/Project/01. YK/react/server/Milestone/test22.m3u8',});//url에 대해선 다음 코드에 설명하겠습니다
//   }).on('error', function(err) {
//       // deleteFolderRecursive('./videos/'+id)
//       console.log(err);
//   }).saveToFile('D:/Project/01. YK/react/server/Milestone/test22.m3u8'); //저장
// })


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

module.exports = router; 