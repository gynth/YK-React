var oracleDb = require('oracledb');
oracleDb.autoCommit = true;
// var dbConfig = require('../Oracle/dbConfig');
const express = require('express');
const router = express.Router();

(async() => {
  await oracleDb.createPool({
    user         : process.env.NODEORACLEDB_USER || 'YK_IMS',
    password     : process.env.NODEORACLEDB_PASSWORD || 'wjdqhykims',
    connectString: process.env.NODEORACLEDB_CONNECTIONSTRING || '10.10.10.11:1521/PROD',
    poolAlias: 'oraclePool',
    // poolMin       : 10,
    // poolMax       : 50
  });
})()

const executeSPYK = async(connection, query, data) => {
  const result = await connection.execute(query, data);
  return result.outBinds.p_out;
}

const executeSP = async(RowStatus, connection, query, data) => {
  
  const queryResult = await connection.execute(query, data);
  let result = {};
  
  let ROWS;
  let SUCCESS  = queryResult.outBinds['p_SUCCESS'];
  let MSG_CODE = queryResult.outBinds['p_MSG_CODE'];
  let MSG_TEXT = queryResult.outBinds['p_MSG_TEXT'];
  let COL_NAM  = queryResult.outBinds['p_COL_NAM'];
 
  //YK sp추가로인한 수정
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

router.post('/SP', async (req, res) => {
  // const connection = await oracleDb.getConnection({
  //   user         : dbConfig.user,
  //   password     : dbConfig.password,
  //   connectString: dbConfig.connectString
  // });
  
  const connection = await oracleDb.getConnection('oraclePool');

  try{
    const param = req.body.param;
    for(let i = 0; i < param.length; i++){
      let query = param[i].sp;
      let data  = param[i].data;
      let errSeq = param[i].errSeq;
      
      data.p_select   = { type: oracleDb.CURSOR, dir: oracleDb.BIND_OUT};
      data.p_SUCCESS  = { type: oracleDb.DB_TYPE_VARCHAR, dir: oracleDb.BIND_OUT};
      data.p_MSG_CODE = { type: oracleDb.DB_TYPE_VARCHAR, dir: oracleDb.BIND_OUT};
      data.p_MSG_TEXT = { type: oracleDb.DB_TYPE_VARCHAR, dir: oracleDb.BIND_OUT};
      data.p_COL_NAM  = { type: oracleDb.DB_TYPE_VARCHAR, dir: oracleDb.BIND_OUT};
    
      const result = await executeSP(param[i].data.p_RowStatus, connection, query, data);
      if(result.SUCCESS === 'N'){
        // connection.rollback((err) => {
        //   if(err !== null)
        //     console.log('rollback Error: ' + err);
        // })
        res.json({
          ROWS    : result.ROWS,
          SUCCESS : result.SUCCESS,
          MSG_CODE: result.MSG_CODE,
          MSG_TEXT: result.MSG_TEXT,
          COL_NAM : result.COL_NAM,
          SEQ     : errSeq
        });
  
        return;
        
      }else{
        if(i === param.length - 1){
          // connection.commit((err) => {
          //   if(err !== null)
          //     console.log('Commit Error: ' + err);
          // })
          res.json({
            ROWS    : result.ROWS,
            SUCCESS : result.SUCCESS,
            MSG_CODE: result.MSG_CODE,
            MSG_TEXT: result.MSG_TEXT,
            COL_NAM : result.COL_NAM,
            SEQ     : errSeq
          });
        }
      }
    }
  }catch(e){
    console.log(e)
    res.json({
      ROWS    : [],
      SUCCESS : 'N',
      MSG_CODE: e,
      MSG_TEXT: e,
      COL_NAM : '',
      SEQ     : 0
    });
  }finally{
    doRelease(connection);
  }
});

router.post('/SPYK', async(req, res) => {
  
  const connection = await oracleDb.getConnection('oraclePool');

  // const connection = await oracleDb.getConnection({
  //   user         : dbConfig.user,
  //   password     : dbConfig.password,
  //   connectString: dbConfig.connectString
  // });

  try{
    const param = req.body.param;
    for(let i = 0; i < param.length; i++){
      let query = param[i].sp;
      let data  = param[i].data;
      let errSeq = param[i].errSeq;
      data.p_out = { type: oracleDb.STRING, dir: oracleDb.BIND_OUT};
      
      const result = await executeSPYK(connection, query, data);
      if(result !== 'OK'){
  
        res.json({scaleNumb: errSeq.delivery_id,
                  seq      : errSeq.seq,
                  result   : result});
        return;
      }
    }
  
    res.json({scaleNumb: '',
              seq      : 0,
              result   : 'OK'});
  }catch(e){
  
    res.json({scaleNumb: '',
              seq      : 0,
              result   : e});
  }finally{
    await doRelease(connection);
  }
});
 
router.post('/Query', async (req, res) => {
  
  // const connection = await oracleDb.getConnection({
  //   user         : dbConfig.user,
  //   password     : dbConfig.password,
  //   connectString: dbConfig.connectString 
  // });

  const connection = await oracleDb.getConnection('oraclePool');

  try{
    const file = req.body.file;
    let Common;
    try{
      Common = require('./Query/' + file);
    }catch(err){
      console.log(err);
    }
  
    if(typeof(Common) !== 'function'){
      console.log('Wrong file location');
      await doRelease(connection);
      res.send({
        result  : false,
        data    : null,
        applyRow: 0,
        code    : '',
        message : 'Wrong file location'
      });
  
      return;
    }
  
    const fn = req.body.fn;
    const param = req.body.param;
    const query = Common(fn, (param !== null && param !== undefined && param.length > 0) && param[0]);
  
    const result = await connection.execute(query);
    res.send(result);
  }catch(e){
    res.send('NG');
  }finally{
  
    await doRelease(connection);
  }

  
});

const doRelease = async (connection) => {
  // console.log('doRelease')
  await connection.close(err => {
    if(err){
      console.log(err.message);
    }
  })
} 

module.exports = router;   