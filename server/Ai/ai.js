const express = require('express');
const router = express.Router();
// const axios = require('axios');
const fs = require('fs');
const fsPromises = fs.promises;
const axios = require('axios');
const moment = require('moment');

let REC_CAR_COUNT = [];
let SNAPSHOT_LIST = [];

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

const callQuery = async(file, fn, param) => {
  const host = 'http://211.231.136.182:3001/Oracle/Query';
  // const host = 'http://10.10.10.136:3001/Oracle/Query';
  // const host = 'http://ims.yksteel.co.kr:90/WebServer/Oracle/Query'; //김경현
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
      console.log(err)
      return err;
    })
};

router.post('/ReRec', async(req, res) => {
  const scaleNumb = req.body.scaleNumb;
  const folder = scaleNumb.substring(0, 8);

  console.log(scaleNumb);

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

  if(REC_SCALENUMB.length > 0){
    for(let i = 0; i < global.REC_SCALENUMB.length; i++){
      //SNAPSHOT_LIST여기에 SCALE_NUMB로 생성된 interval이 없으면 한번 실행 후 생성

      const interval = SNAPSHOT_LIST.filter(e => {
        if(e.SCALE_NUMB === global.REC_SCALENUMB[i])
          return true;
      })

      if(interval === null || interval === undefined){
        const result = await callQuery('Common/Common', '')
      }
    }
  }

  res.json({
    Response: 'OK'
  });
});

setInterval(() => {
  for(let i = 0; i < global.REC_SCALENUMB.length; i++){
    
  }

  for(let i = 0; i < SNAPSHOT_LIST.length; i++){

  }
}, 5000);

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

        console.log('Rec Wait', new Date());
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
                console.log('Ai 녹화시작 실패');
              }else{
                console.log('Rec Stop!!', new Date());
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
            console.log('Ai 녹화시작 실패');
          }
        }catch(e){

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