const axios = require('axios');
const moment = require('moment');
var edge = require('edge-js');

global.MILESTONE_REPLAY = {};

const callLog = async(folder, msg) => {
  const host = 'http://localhost:3001/Log';
  // const host = 'http://211.231.136.182:3001/Oracle/SP';
  const option = {
    url   : host,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data: {
      folder,
      msg
    } ,
    timeout: 30000
  };

  return axios(option)
    .then(res => {
      return res
    })
    .catch(err => {
      console.log(err)
      return err;
    })
}

const callSp = async(param) => {
  const host = 'http://localhost:3001/Oracle/SP';
  // const host = 'http://211.231.136.182:3001/Oracle/SP';
  const option = {
    url   : host,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data: {
      param
    } ,
    timeout: 30000
  };

  return axios(option)
    .then(res => {
      return res
    })
    .catch(err => {
      console.log(err)
      return err;
    })
}

let procYn = 'N';
setInterval(async() => {
  callLog('Encoding', `${procYn} ${new Date()}`);

  // await sleep(1000);
  if(procYn === 'N'){
    let param = [];
    param.push({
      sp   : `begin 
                SP_ZM_IMS_REC(
                  :p_RowStatus,
                  :p_scaleNumb,
                  :p_seq,
                  :p_cameraNo,
                  :p_cameraDevice,
                  :p_cameraName,
                  :p_UserId,
                  
                  :p_select,
                  :p_SUCCESS,
                  :p_MSG_CODE,
                  :p_MSG_TEXT,
                  :p_COL_NAM
                );
              end;
              `,
      data : {
        p_RowStatus    : 'R1',
        p_scaleNumb    : '',
        p_seq          : 0,
        p_cameraNo     : '',
        p_cameraDevice : '',
        p_cameraName   : '',
        p_UserId       : 'Encoding'
      },
      errSeq: 0
    })
  
    try{
      const select = await callSp(param);
      if(select.data.SUCCESS === 'Y'){
        procYn = 'Y';
  
        try{
          const ROWS = select.data.ROWS;
          const cnt = ROWS.length;
                      
          const scaleNumb   = ROWS[0].SCALENUMB;
  
          const seq         = ROWS[0].SEQ;
          const rec_fr_dttm = moment(ROWS[0].REC_FR_DTTM).format('yyyy-MM-DD HH:mm:ss');
          const rec_to_dttm = moment(ROWS[0].REC_TO_DTTM).format('yyyy-MM-DD HH:mm:ss');
          const Guid        = ROWS[0].CAMERA_GUID;
          const Name        = ROWS[0].CAMERA_NAME;
      
          //설정된 메서드가 없으면 생성.
          if(global.MILESTONE_REPLAY[Guid] === undefined){
            let Connect = edge.func({
              assemblyFile:`${__dirname}/Milestone/Milestone.dll`,
              methodName: 'Connect'
            });
              
            Connect([Guid, Guid, 'Start', '', scaleNumb, '', Name], (error, result) => { 
              if(result[1] === 'Y') {
                global.MILESTONE_REPLAY[Guid] = {
                  method : Connect,
                  recYn  : 'N'
                }
              }
            })
          }
          
          console.log('make1: ', new Date())
          await global.MILESTONE_REPLAY[Guid].method([Guid, Guid, 'Video', '', scaleNumb, '', Name, '', rec_fr_dttm, rec_to_dttm], async (error, result) => { 
            if(result === '0') {
              console.log('make2: ', new Date())
              console.log('seq:', seq);
  
              let param2 = [];
              param2.push({
                sp   : `begin 
                          SP_ZM_IMS_REC(
                            :p_RowStatus,
                            :p_scaleNumb,
                            :p_seq,
                            :p_cameraNo,
                            :p_cameraDevice,
                            :p_cameraName,
                            :p_UserId,
                            
                            :p_select,
                            :p_SUCCESS,
                            :p_MSG_CODE,
                            :p_MSG_TEXT,
                            :p_COL_NAM
                          );
                        end;
                        `,
                data : {
                  p_RowStatus    : 'D',
                  p_scaleNumb    : scaleNumb,
                  p_seq          : seq,
                  p_cameraNo     : '',
                  p_cameraDevice : Guid,
                  p_cameraName   : '',
                  p_UserId       : 'Encoding'
                },
                errSeq: 0
              })
            
              const result2 = await callSp(param2);
              if(result2.data.SUCCESS === 'Y'){
                console.log(`${scaleNumb} : 영상녹화 저장에 성공했습니다.`);
                callLog('Encoding', `${scaleNumb} : 영상녹화 저장에 성공했습니다.`);
              }
              else{
                console.log(`${scaleNumb} : 영상녹화 저장에 실패했습니다. ${Guid}, ${result2.data.MSG_TEXT}`);
                callLog('Encoding', `${scaleNumb} : 영상녹화 저장에 실패했습니다. ${Guid}, ${result2.data.MSG_TEXT}`);
              }
              
              procYn = 'N';
            }else {
              console.log('영상녹화 파일생성에 실패 했습니다.');
              callLog('Encoding', '영상녹화 파일생성에 실패 했습니다.');
  
              let param2 = [];
              param2.push({
                sp   : `begin 
                          SP_ZM_IMS_REC(
                            :p_RowStatus,
                            :p_scaleNumb,
                            :p_seq,
                            :p_cameraNo,
                            :p_cameraDevice,
                            :p_cameraName,
                            :p_UserId,
                            
                            :p_select,
                            :p_SUCCESS,
                            :p_MSG_CODE,
                            :p_MSG_TEXT,
                            :p_COL_NAM
                          );
                        end;
                        `,
                data : {
                  p_RowStatus    : 'D2',
                  p_scaleNumb    : scaleNumb,
                  p_seq          : seq,
                  p_cameraNo     : '',
                  p_cameraDevice : '',
                  p_cameraName   : '',
                  p_UserId       : 'Encoding'
                },
                errSeq: 0
              })
            
              const result3 = await callSp(param2);
              if(result3.SUCCESS === 'Y'){
                console.log(`${scaleNumb} : 영상녹화 실패 삭제.`);
                callLog('Encoding', `${scaleNumb} : 영상녹화 실패 삭제1.`);
              }
              else{
                console.log(`${scaleNumb} : 영상녹화 실패 삭제.`);
                callLog('Encoding', `${scaleNumb} : 영상녹화 실패 삭제2.`);
              }
              
              procYn = 'N';
            }
          })
        }catch(e){
          procYn = 'N';
          callLog('Encoding', e);
          console.log(e);
        }
      }
    }catch(e){
      if(procYn === 'Y')
        procYn = 'N';
    }
  }
}, 5000);

const sendScaleNumbList = async() => {
  const host = 'http://10.10.10.136:3128/Ai/GetRecodingList';
  const option = {
    url   : host,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data: {
      REC_SCALENUMB
    } ,
    timeout: 10000
  };

  return axios(option)
    .then(res => {
      return res
    })
    .catch(err => {
      callLog('Encoding', `sendScaleNumbList: ${err}`);
      console.log(err)
    })
}


//인코딩 작업 때문에 여기가 영향을 받으면 이건 AI쪽으로 빼던지 해야함.
let REC_SCALENUMB = [];
setInterval(async() => {
  await sendScaleNumbList();

  let param = [];
  param.push({
    sp   : `begin 
              SP_ZM_IMS_REC(
                :p_RowStatus,
                :p_scaleNumb,
                :p_seq,
                :p_cameraNo,
                :p_cameraDevice,
                :p_cameraName,
                :p_UserId,
                
                :p_select,
                :p_SUCCESS,
                :p_MSG_CODE,
                :p_MSG_TEXT,
                :p_COL_NAM
              );
            end;
            `,
    data : {
      p_RowStatus    : 'R3',
      p_scaleNumb    : '',
      p_seq          : 0,
      p_cameraNo     : '',
      p_cameraDevice : '',
      p_cameraName   : '',
      p_UserId       : 'Encoding'
    },
    errSeq: 0
  })

  try{
    const result = await callSp(param);
    if(result.data.SUCCESS === 'Y'){
        
      const ROWS = result.data.ROWS;
      for(let i = 0; i < ROWS.length; i++){
        const scaleNumb = ROWS[i].SCALENUMB;
        const oldData = REC_SCALENUMB.find(e => e === scaleNumb);
        if(!oldData){
          REC_SCALENUMB.push(scaleNumb);
        }
      }
  
      for(let i = 0; i < REC_SCALENUMB.length; i++){
        const scaleNumb = REC_SCALENUMB[i];
        const newData = ROWS.find(e => e.SCALENUMB === scaleNumb);
  
        if(!newData){
          REC_SCALENUMB = REC_SCALENUMB.filter(e => e !== scaleNumb);
        }
      }
    }else{
      REC_SCALENUMB = [];
    }
  }catch(e){
    callLog('Encoding', `setInterval: ${e}`);
  }
  
}, 2000);

const sleep = (ms) => {
  return new Promise(resolve=>setTimeout(resolve, ms));
}

console.log('Encoding Server Start');