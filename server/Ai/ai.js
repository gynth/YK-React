const express = require('express');
const router = express.Router();
// const axios = require('axios');
const fs = require('fs');
const fsPromises = fs.promises;
const axios = require('axios');

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
    timeout: 10000
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

router.post('/GetRecodingList', async(req, res) => {

  const REC_SCALENUMB = req.body.REC_SCALENUMB;
  global.REC_SCALENUMB = REC_SCALENUMB;

  res.json({
    Response: 'OK'
  });
});

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

  console.log(SP, ' ', new Date())

  const select = await callSp(SP);

  res.json(select.data.ROWS);
});

router.post('/Result', async(req, res) => {
  const Count = req.body.Count;
  const Result = req.body.Result;
  const CameraNo = 1;
  // if(Count !== undefined){
  //   console.log(`Count: ${Count}`);
  // }

  if(Result !== undefined){

    for(let i = 0; i < Result.length; i++){
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
      
        const select = await callSp(param);
        
        if(select.data.SUCCESS !== 'Y'){
          console.log('Ai 녹화시작 실패');
        }
      }
    }
  }

  res.json({
    Response: 'OK'
  });
});

module.exports = router;