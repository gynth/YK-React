const express = require('express');
const router = express.Router();
const axios = require('axios');

const OracleServerSP = (param) => {
  for(let j = 0; j < param.length; j++){
    let keys = Object.keys(param[j].data);
    for(let i = 0; i < keys.length; i++){
      if(param[j].data[keys[i]] === null || param[j].data[keys[i]] === undefined){
        param[j].data[keys[i]] = '';
      }
    }
  }
  
  // const host = 'http://ims.yksteel.co.kr:90/WebServer/Oracle/SP';
  const host = 'http://10.10.10.136:3001/Oracle/SP';
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

router.post('/Result', async(req, res) => {
  const Count = req.body.Count;
  const Result = req.body.Result;
  const CameraNo = 1;

  if(Count !== undefined){
    console.log(`Count: ${Count}`);
  }

  if(Result !== undefined){

    
    // console.log(Result.length);
    
    for(let i = 0; i < Result.length; i++){
      console.log(Result[i])


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
      
        const select = await OracleServerSP(param);
        
        if(select.data.SUCCESS !== 'Y'){
          console.log('Ai ' + select.data);
        }
      }
    }
  }

  res.json({
    Response: 'OK'
  });

  // const img = req.body.img.replace('data:image/png;base64,', '');
  // let filename = req.body.filename;
  // let root = req.body.root;

  // if(root === undefined){
  //   if(!fs.existsSync('../screenshot')){
  //     fs.mkdirSync('../screenshot');
  //   }

  //   root = `../screenshot/${getToday()}`;

  //   if(!fs.existsSync(root)){
  //     fs.mkdirSync(root);
  //   }
  // }

  // if(filename === undefined){
  //   filename = `${getCurrentDate()}.png`;
  // }

  // fs.writeFile(`${root}\\${filename}`, img, 'base64', function(err) {
  //   res.json(err);
  // });
});

module.exports = router;