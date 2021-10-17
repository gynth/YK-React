var oracleDb = require('oracledb');
oracleDb.stmtCacheSize = 100;
oracleDb.queueMax = 500;

// oracleDb.queueMax = 1000;
// oracleDb.stmtCacheSize = 50;

// oracleDb.autoCommit = true;
// var dbConfig = require('../Oracle/dbConfig');
const express = require('express');
const router = express.Router();

(async() => {
  await oracleDb.createPool({
    // user         : process.env.NODEORACLEDB_USER || 'YK_IMS',
    // password     : process.env.NODEORACLEDB_PASSWORD || 'wjdqhykims',
    // connectString: process.env.NODEORACLEDB_CONNECTIONSTRING || '10.10.10.11:1521/PROD',
    user         : 'YK_IMS',
    password     : 'wjdqhykims',
    connectString: '10.10.10.11:1521/PROD',
    poolAlias    : 'oraclePool',
    // poolMin      : 1,
    // poolMax      : 2
    // events       : false,
    // queueMax     : 1000,
    // stmtCacheSize : 50
  });
})()

const executeSPYK = async(connection, query, data) => {
  const result = await connection.execute(query, data);
  return result.outBinds.p_out;
}

const executeSP = async(RowStatus, connection, query, data) => {
  
  let result = {};

  try{
    const queryResult = await connection.execute(query, data);
    
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
  }catch(e){
    result.ROWS     = null;
    result.SUCCESS  = 'N';
    result.MSG_CODE = 'MSG01';
    result.MSG_TEXT = 'MSG01';
    result.COL_NAM  = '';
    return result;
  }
}

const fetchRowsFromRS = async(result) => {
  const p_select = await result.outBinds['p_select'];
  const resultSet = await p_select.getRows();
  const column = await p_select.metaData;

  // let rows;
  // let row;
  // while (row = await p_select.getRow()) {
  //   rows.push(row)
  // }

  
  let data = [];
  for(let i = 0; i < resultSet.length; i++){

    let col = {};
    for(let j = 0; j < resultSet[i].length; j++){
      col[column[j].name] = resultSet[i][j];
    }
    data.push(col);
  }

  await p_select.close();

  return data;
}

let cnt = 0;
router.post('/SP', async(req, res) => {
  const connection = await oracleDb.getConnection('oraclePool');

  try{
    const param = req.body.param;
    for(let i = 0; i < param.length; i++){

      let query = param[i].sp;
      let data  = param[i].data;
      data.p_select   = { type: oracleDb.CURSOR, dir: oracleDb.BIND_OUT};
      data.p_SUCCESS  = { type: oracleDb.DB_TYPE_VARCHAR, dir: oracleDb.BIND_OUT};
      data.p_MSG_CODE = { type: oracleDb.DB_TYPE_VARCHAR, dir: oracleDb.BIND_OUT};
      data.p_MSG_TEXT = { type: oracleDb.DB_TYPE_VARCHAR, dir: oracleDb.BIND_OUT};
      data.p_COL_NAM  = { type: oracleDb.DB_TYPE_VARCHAR, dir: oracleDb.BIND_OUT};
  
      let errSeq = param[i].errSeq;
  
      cnt++;
      // console.log(`${cnt} -> call: ${query}`)
      if(cnt % 10 === 0){
        console.log(`${cnt}`)
        const mem = process.memoryUsage()
        const heapUsed = Math.round(mem.heapUsed / 1024 / 1024 * 100) / 100;
        const external = Math.round(mem.external / 1024 / 1024 * 100)  / 100;
        const heapTotal = Math.round(mem.heapTotal / 1024 / 1024 * 100) / 100;
        const rss = Math.round(mem.rss / 1024 / 1024 * 100) / 100;
        console.log(`heap used: ${heapUsed} MB, heap total: ${heapTotal} MB, rss: ${rss} MB, external: ${external} MB`);
      
        if(cnt === 10000) cnt = 0;
      }
      const result = await executeSP(param[i].data.p_RowStatus, connection, query, data);
      if(result.SUCCESS === 'N'){
        // console.log('3:', new Date())
  
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
          // console.log('2:', new Date())
          
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
    
  }finally{
    await doRelease(connection);
  }
});

router.post('/SPYK', async(req, res) => {
  
  const connection = await oracleDb.getConnection('oraclePool');
  // const connection = await oracleDb.getConnection();

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
    console.log(e)
  
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
  // const connection = await oracleDb.getConnection();

  try{
    const file = req.body.file;
    let Common;
    try{
      Common = require('./Query/' + file);
    }catch(err){
      console.log(err);
    }
  
    if(typeof(Common) !== 'function'){
      await doRelease(connection);
      console.log('Wrong file location');
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
    await doRelease(connection);
    res.send(result);
  }catch(e){
    console.log(e)
    res.send('NG');
  }finally{

  }

  
});

const doRelease = async (connection) => {
  // // await connection.release(err => {
  // await connection.close(err => {
  //   if(err){
  //     console.log(err.message);
  //   }else{
  //     closecnt += 1;
  //     console.log('close: ', closecnt);
  //   }
  // })

  // await connection.release(err => {
  const err = await connection.close();
  if(err){
    console.log(err.message);
  }
} 

module.exports = router;   