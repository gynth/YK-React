const express = require('express');
const router = express.Router();
// const axios = require('axios');
const fs = require('fs');
const fsPromises = fs.promises;
const axios = require('axios');
const moment = require('moment');

let REC_CAR_COUNT = [];
let SNAPSHOT_LIST = [];

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
      callLog('AI', `callSp: ${err}`);
      return err;
    })
}

const callQuery = async(file, fn, param) => {
  // const host = 'http://211.231.136.182:3001/Oracle/Query';
  const host = 'http://10.10.10.136:3001/Oracle/Query';
  // const host = 'http://ims.yksteel.co.kr:90/WebServer/Oracle/Query';
  const option = {
    url   : host,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data: {
      file,
      fn,
      param
    } ,
    timeout: 30000
  };

  return axios(option)
    .then(res => {
      return res
    })
    .catch(err => {
      callLog('AI', `callQuery: ${err}`);
      return err;
    })
};

router.post('/ReRec', async(req, res) => {
  const scaleNumb = req.body.scaleNumb;
  const folder = scaleNumb.substring(0, 8);

  callLog('AI', `ReRec: ${scaleNumb}`);

  if(fs.existsSync(`F:/IMS/Replay/${folder}/${scaleNumb}`)){
    const root = fs.readdirSync(`F:/IMS/Replay/${folder}`);
    const fileCnt = root.filter(e => e.toString().indexOf(`${scaleNumb}_`) >= 0);
  
    const rename = await fsPromises.rename(`F:/IMS/Replay/${folder}/${scaleNumb}`, `F:/IMS/Replay/${folder}/${scaleNumb}_${fileCnt.length + 1}`);
    console.log(rename);
    // .then(e => {
      res.json({
        Response: 'OK'
      });
    // })
  }else{
    res.json({
      Response: 'OK'
    });
  }
});

router.post('/RecodingList', async(req, res) => {
  res.json({
    Response: global.REC_SCALENUMB
  });
});

//2초에 한번씩 녹화대기 리스트가 넘어옴. (배열)
router.post('/GetRecodingList', async(req, res) => {

  const REC_SCALENUMB = req.body.REC_SCALENUMB;
  global.REC_SCALENUMB = REC_SCALENUMB;

  res.json({
    Response: 'OK'
  });
});

setInterval(async () => {
  try{
    for(let i = 0; i < global.REC_SCALENUMB.length; i++){
      const interval = SNAPSHOT_LIST.filter(e => {
        if(e.SCALENUMB === global.REC_SCALENUMB[i])
          return true;
      })

      if(interval === undefined || interval === null || interval.length === 0){
        const result = await callQuery('Common/Common', 'ZM_IMS_CAMERA_SELECT2', [{SCALENUMB: global.REC_SCALENUMB[i]}]);
        
        if(result.data.rows.length > 0){

          for(let j = 0; j < result.data.rows.length; j++){
            const scaleNumb = global.REC_SCALENUMB[i];
            const time =  result.data.rows[j][1];
            const device = result.data.rows[j][2];
            
            await SNAPSHOT(device, scaleNumb, `_${j + 1}`)

            const camInterval = setInterval(async() => {
              await SNAPSHOT(device, scaleNumb, `_${j + 1}`)
            }, time);

            SNAPSHOT_LIST.push({SCALENUMB: global.REC_SCALENUMB[i],
                                interval : camInterval,
                                time     : time,
                                device   : device
            })
          }
        }
      }
    }
  
    for(let i = 0; i < SNAPSHOT_LIST.length; i++){
      const find = global.REC_SCALENUMB.find(e => e === SNAPSHOT_LIST[i].SCALENUMB);
      if(find === undefined || find === null || find.length === 0){
        const clear = SNAPSHOT_LIST.filter(e => e.SCALENUMB === SNAPSHOT_LIST[i].SCALENUMB);
        for(let j = 0; j < clear.length; j++){
          clearInterval(
            clear[j].interval
          )
        }

        SNAPSHOT_LIST = SNAPSHOT_LIST.filter(e => e.SCALENUMB !== SNAPSHOT_LIST[i].SCALENUMB)
      }
    }

    // for(let i = 0; i < SNAPSHOT_LIST.length; i++){
    //   console.log(SNAPSHOT_LIST[i])
    // }
  }catch(e){
    callLog('AI', `setInterval: ${e}`);
  }
}, 1000);

const SNAPSHOT = (device, scaleNo, fileName) => {
  const host = `http://localhost:3001/ScreenShot/Milestone`;
  const option = {
    url   : host,
    method: 'POST',
    // headers: {
    //   'Access-Control-Allow-Origin': '*'
    // },
    data: {
      device, scaleNo, fileName
    } 
  };

  return axios(option)
    .then(res => {
      return res
    })
    .catch(err => {
      callLog('AI', `SNAPSHOT: ${err}`);
      return err;
    })
}

router.post('/MstrWait', async(req, res) => {

  let SP = [];
  SP.push({
    sp   : `begin 
              SP_ZM_MSTR_WAIT(
                :p_select,
                :p_SUCCESS,
                :p_MSG_CODE,
                :p_MSG_TEXT,
                :p_COL_NAM
              );
            end;
            `,
    data: {},
    errSeq: 0
  })

  try{
    const select = await callSp(SP);
    res.json(select.data.ROWS);
  }catch(e){
    callLog('AI', `MstrWait: ${e}`);
    res.json('');
  }

});

router.post('/Result', async(req, res) => {
  const Count = req.body.Count;
  const Result = req.body.Result;
  const CameraNo = 1;
  if(Count !== undefined){
    console.log(Count)
    
    if(REC_CAR_COUNT[CameraNo] === undefined){
      REC_CAR_COUNT[CameraNo] = {
        Count: Count,
        Date : null
      };
    }

    //녹화중인건이 없는경우
    if(Count === 0){

      if(REC_CAR_COUNT[CameraNo].Count > 0){
        REC_CAR_COUNT[CameraNo] = {
          Count: 0,
          Date: new Date()
        };
      }else{
        //계속 0이 들어오는경우에 기존의 Date보다 10초가 지난경우면 녹화종료 처리
        const befDate = REC_CAR_COUNT[CameraNo].Date;

        if(befDate !== null){
          const chkBefDt = moment(befDate).add(+10, 'second');
          const newDate = new Date();
          if(chkBefDt.valueOf() < newDate.valueOf()){

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
                p_RowStatus    : 'I4',
                p_scaleNumb    : '',
                p_seq          : 0,
                p_cameraNo     : CameraNo,
                p_cameraDevice : '',
                p_cameraName   : '',
                p_UserId       : 'Ai'
              },
              errSeq: 0
            })
          
            try{
              const select = await callSp(param);
              
              if(select.data.SUCCESS !== 'Y'){
                callLog('AI', 'Ai 녹화시작 실패');
              }else{
                callLog('AI', 'Rec Stop!!', new Date());
              }
            }catch(e){
    
            }

            REC_CAR_COUNT[CameraNo] = {
              Count: 0,
              Date: null
            };
          }
        }
      }
    }else{
      REC_CAR_COUNT[CameraNo] = {
        Count: Count,
        Date : null
      };
    }
  }

  if(Result !== undefined){

    for(let i = 0; i < Result.length; i++){
      console.log(Result[i]);
      if(Result[i].procYn === 'Y'){

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
            p_RowStatus    : 'I1',
            p_scaleNumb    : Result[i].scaleNumb,
            p_seq          : 0,
            p_cameraNo     : CameraNo,
            p_cameraDevice : '',
            p_cameraName   : '',
            p_UserId       : 'Ai'
          },
          errSeq: 0
        })
      
        try{
          const select = await callSp(param);
          
          if(select.data.SUCCESS !== 'Y'){
            callLog('AI', 'Ai 녹화시작 실패');
          }
        }catch(e){
          callLog('AI', `Ai 녹화시작 실패: ${e}`);
        }
      }else{
        
      }
    }
  }

  res.json({
    Response: 'OK'
  });
});

module.exports = router;