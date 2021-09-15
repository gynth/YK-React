var oracleDb = require('oracledb');
var dbConfig = require('../Oracle/dbConfig');
const express = require('express');
const router = express.Router();

const executeSPYK = async(connection, query, data) => {
  const result = await connection.execute(query, data);
  return result.outBinds.p_out;
}

const executeSP = async(connection, query, data) => {
  const result = await connection.execute(query, data);
  return result;
}

const executeQuery = async(connection, query) => {
  const result = await connection.execute(query);
  
  return result;
}

router.post('/SP', (req, res) => {
  oracleDb.getConnection({
    user         : dbConfig.user,
    password     : dbConfig.password,
    connectString: dbConfig.connectString
  },
  async (err, connection) => {
    if(err){
      console.log(err.message);
      return;
    }

    let result;
    
    const param = req.body.param;
    for(let i = 0; i < param.length; i++){
      let query = param[i].sp;
      let data  = param[i].data;
      let errSeq = param[i].errSeq;
      data.p_select   = { type: oracleDb.STRING, dir: oracleDb.BIND_OUT};
      data.p_SUCCESS  = { type: oracleDb.STRING, dir: oracleDb.BIND_OUT};
      data.p_MSG_CODE = { type: oracleDb.STRING, dir: oracleDb.BIND_OUT};
      data.p_MSG_TEXT = { type: oracleDb.STRING, dir: oracleDb.BIND_OUT};
      data.p_COL_NAM  = { type: oracleDb.STRING, dir: oracleDb.BIND_OUT};
      
      result = await executeSP(connection, query, data);
      if(result.outBinds.p_SUCCESS !== 'Y'){

        connection.rollback((err) => {
          if(err !== null)
            console.log('rollback Error: ' + err);
        })

        doRelease(connection);
        res.json({seq      : errSeq,
                  select   : result.outBinds.p_select,
                  success  : result.outBinds.p_SUCCESS,
                  msg_code : result.outBinds.p_SUCCESS,
                  msg_text : result.outBinds.p_MSG_TEXT,
                  col_nam  : result.outBinds.p_COL_NAM});
        return;
      }
    }

    connection.commit((err) => {
      if(err !== null)
        console.log('Commit Error: ' + err);
    })

    res.json({
      seq      : 0,
      select   : result.outBinds.p_select,
      success  : result.outBinds.p_SUCCESS,
      msg_code : result.outBinds.p_SUCCESS,
      msg_text : result.outBinds.p_MSG_TEXT,
      col_nam  : result.outBinds.p_COL_NAM});
  }) 
});

router.post('/SPYK', (req, res) => {
  oracleDb.getConnection({
    user         : dbConfig.user,
    password     : dbConfig.password,
    connectString: dbConfig.connectString
  },
  async (err, connection) => {
    if(err){
      console.log(err.message);
      return;
    }
    
    const param = req.body.param;
    for(let i = 0; i < param.length; i++){
      let query = param[i].sp;
      let data  = param[i].data;
      let errSeq = param[i].errSeq;
      data.p_out = { type: oracleDb.STRING, dir: oracleDb.BIND_OUT};
      
      const result = await executeSPYK(connection, query, data);
      if(result !== 'OK'){

        connection.rollback((err) => {
          if(err !== null)
            console.log('rollback Error: ' + err);
        })

        doRelease(connection);
        res.json({scaleNumb: errSeq.delivery_id,
                  seq      : errSeq,
                  result   : result});
        return;
      }
    }

    connection.commit((err) => {
      if(err !== null)
        console.log('Commit Error: ' + err);
    })

    res.json({scaleNumb: 'OK',
              seq      : 0,
              result   : 'OK'});
  }) 
});
 
router.post('/Query', (req, res) => {
  oracleDb.getConnection({
    user         : dbConfig.user,
    password     : dbConfig.password,
    connectString: dbConfig.connectString
  },
  async (err, connection) => {
    if(err){
      console.log(err.message);
      return;
    }

    const reqFile = req.body.file;
    const reqFn = req.body.fn;
    const reqParam = req.body.param;
    const reqSeq = req.body.seq;
    let queryResult;
    const setResult = (result) => {
      queryResult = result;
    }

    for(let i = 0; i < reqFile.length; i++){
      const file = reqFile[i];
      let Common;
      try{
        Common = require('./Query/' + file);
      }catch(err){
        console.log(err);
      }

      if(typeof(Common) !== 'function'){
        console.log('Wrong file location');
    
        connection.rollback((err) => {
          if(err !== null)
            console.log('rollback Error: ' + err);
        })

        res.json({
          result  : false,
          rows    : 0,
          data    : '',
          message : 'Wrong file location'
        });

        return;
      }
      
      const query = Common(reqFn[i], reqParam[i]);

      const result = await executeQuery(connection, query);
      console.log(result);
      // if(result !== 'OK'){

      //   connection.rollback((err) => {
      //     if(err !== null)
      //       console.log('rollback Error: ' + err);
      //   })

      //   doRelease(connection);
      //   res.json({scaleNumb: errSeq.delivery_id,
      //             seq      : errSeq,
      //             result   : result});
      //   return;
      // }
    }

    connection.commit((err) => {
      if(err !== null)
        console.log('commit Error: ' + err);
    })

    console.log(1);
    res.json({
      result  : true,
      rows    : 0,
      data    : queryResult,
      message : 'OK'
    });

    // const file = req.body.file;
    // let Common;
    // try{
    //   Common = require('./Query/' + file);
    // }catch(err){
    //   console.log(err);
    // }

    // if(typeof(Common) !== 'function'){
    //   console.log('Wrong file location');
    //   res.send({
    //     result  : false,
    //     data    : null,
    //     applyRow: 0,
    //     code    : '',
    //     message : 'Wrong file location'
    //   });

    //   return;
    // }

    // const param = req.body.param;

    // for(let i = 0; i < param.length; i++){
    //   const fn = req.body.fn[i];
    //   const query = Common(fn, param);

    //   connection.execute(query, (err, result) => {
    //     if(err){
    //       console.log(err.message);
    //       doRelease(connection);
    //       return;
    //     }else{
    //       connection.commit((err) => {
    //         if(err !== null)
    //           console.log('Commit Error: ' + err);
    //       })
    //     }
  
    //     // console.log(result);
    //     res.send(result);
    //   })
    // }
  })
});

const doRelease = (connection) => {
  connection.close(err => {
    if(err){
      console.log(err.message);
    }
  })
} 

module.exports = router;      