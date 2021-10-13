const express = require('express');
const router = express.Router();
// const axios = require('axios');
const fs = require('fs');
var dbConfig = require('../db/Oracle/dbConfig');

var oracleDb = require('oracledb');
oracleDb.autoCommit = true;

(async() => {
  await oracleDb.createPool({
    user         : process.env.NODEORACLEDB_USER || 'YK_IMS',
    password     : process.env.NODEORACLEDB_PASSWORD || 'wjdqhykims',
    connectString: process.env.NODEORACLEDB_CONNECTIONSTRING || '10.10.10.11:1521/PROD',
    poolAlias: 'aiPool',
    poolMin      : 1,
    poolMax      : 2
  });
})()

const executeSP = async(RowStatus, connection, query, data) => {
  
  const queryResult = await connection.execute(query, data);
  let result = {};
  
  let ROWS;
  let SUCCESS  = queryResult.outBinds['p_SUCCESS'];
  let MSG_CODE = queryResult.outBinds['p_MSG_CODE'];
  let MSG_TEXT = queryResult.outBinds['p_MSG_TEXT'];
  let COL_NAM  = queryResult.outBinds['p_COL_NAM'];

  if(RowStatus === undefined){
    ROWS = await fetchRowsFromRS(queryResult);

    if(ROWS.length === 0){
      ROWS     = null;
      SUCCESS  = 'N';
      MSG_CODE = 'MSG01';
      MSG_TEXT = 'MSG01';
      COL_NAM  = '';
    }
  }
  else if(RowStatus.indexOf('R') >= 0){
    ROWS = await fetchRowsFromRS(queryResult);

    if(ROWS.length === 0){
      ROWS     = null;
      SUCCESS  = 'N';
      MSG_CODE = 'MSG01';
      MSG_TEXT = 'MSG01';
      COL_NAM  = '';
    }
  }else{
    if(SUCCESS !== 'Y'){
      console.log(result);
    }
  }

  result.ROWS     = ROWS;
  result.SUCCESS  = SUCCESS;
  result.MSG_CODE = MSG_CODE;
  result.MSG_TEXT = MSG_TEXT;
  result.COL_NAM  = COL_NAM;

  return result;
}

const fetchRowsFromRS = async(result) => {
  const resultSet = await result.outBinds['p_select'].getRows();
  const column = await result.outBinds['p_select'].metaData;
  
  let data = [];
  for(let i = 0; i < resultSet.length; i++){

    let col = {};
    for(let j = 0; j < resultSet[i].length; j++){
      col[column[j].name] = resultSet[i][j];
    }
    data.push(col);
  }

  return data;
}

const OracleServerSP = async (param) => {
  for(let j = 0; j < param.length; j++){
    let keys = Object.keys(param[j].data);
    for(let i = 0; i < keys.length; i++){
      if(param[j].data[keys[i]] === null || param[j].data[keys[i]] === undefined){
        param[j].data[keys[i]] = '';
      }
    }
  }

  const connection = await oracleDb.getConnection('aiPool');
  // for(let i = 0; i < param.length; i++){
  // const connection = await oracleDb.getConnection({
  //   user         : dbConfig.user,
  //   password     : dbConfig.password,
  //   connectString: dbConfig.connectString
  // });    
  let query = param[0].sp;
  let data  = param[0].data;
  let errSeq = param[0].errSeq;
  
  data.p_select   = { type: oracleDb.CURSOR, dir: oracleDb.BIND_OUT};
  data.p_SUCCESS  = { type: oracleDb.DB_TYPE_VARCHAR, dir: oracleDb.BIND_OUT};
  data.p_MSG_CODE = { type: oracleDb.DB_TYPE_VARCHAR, dir: oracleDb.BIND_OUT};
  data.p_MSG_TEXT = { type: oracleDb.DB_TYPE_VARCHAR, dir: oracleDb.BIND_OUT};
  data.p_COL_NAM  = { type: oracleDb.DB_TYPE_VARCHAR, dir: oracleDb.BIND_OUT};

  try{
    const result = await executeSP(param[0].data.p_RowStatus, connection, query, data);

  
    return result;
  }catch(e){

  }finally{
    await doRelease(connection);
  }
}

router.post('/ReRec', async(req, res) => {
  const scaleNumb = req.body.scaleNumb;
  const folder = scaleNumb.substring(0, 8);

  if(fs.existsSync(`F:/IMS/Replay/${folder}/${scaleNumb}`)){
    const root = fs.readdirSync(`F:/IMS/Replay/${folder}`);
    const fileCnt = root.filter(e => e.toString().indexOf(`${scaleNumb}_`) >= 0);
  
    fs.rename(`F:/IMS/Replay/${folder}/${scaleNumb}`, `F:/IMS/Replay/${folder}/${scaleNumb}_${fileCnt.length + 1}`).then(e => {
      res.json({
        Response: 'OK'
      });
    })
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

  const select = await OracleServerSP(SP);

  res.json(select.ROWS);
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
      
        const select = await OracleServerSP(param);
        
        if(select.SUCCESS !== 'Y'){
          console.log('Ai 녹화시작 실패');
        }
      }
    }
  }

  res.json({
    Response: 'OK'
  });
});

const doRelease = async (connection) => {
  // await connection.release(err => {
  await connection.close(err => {
    if(err){
      console.log(err.message);
    }
  })
} 

module.exports = router;