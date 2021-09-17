var oracleDb = require('oracledb');
var dbConfig = require('../Oracle/dbConfig');
const express = require('express');
const router = express.Router();

const executeSPYK = async(connection, query, data) => {
  const result = await connection.execute(query, data);
  return result.outBinds.p_out;
}

const executeSP = async(RowStatus, connection, query, data) => {
  console.log(data);
  const queryResult = await connection.execute(query, data);
  let result = {};
  
  let ROWS;
  let SUCCESS  = queryResult.outBinds['p_SUCCESS'];
  let MSG_CODE = queryResult.outBinds['p_MSG_CODE'];
  let MSG_TEXT = queryResult.outBinds['p_MSG_TEXT'];
  let COL_NAM  = queryResult.outBinds['p_COL_NAM'];

  if(RowStatus === 'R'){
    ROWS = await fetchRowsFromRS(queryResult);

    if(ROWS.length === 0){
      ROWS     = null;
      SUCCESS  = 'N';
      MSG_CODE = 'MSG01';
      MSG_TEXT = 'MSG01';
      COL_NAM  = '';
    }
  }

  result.ROWS     = ROWS;
  result.SUCCESS  = SUCCESS;
  result.MSG_CODE = MSG_CODE;
  result.MSG_TEXT = MSG_TEXT;
  result.COL_NAM  = COL_NAM;
  
  // console.log(result);

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

router.post('/SP', (req, res) => {
  oracleDb.getConnection({
    user         : dbConfig.user,
    password     : dbConfig.password,
    connectString: dbConfig.connectString
  },
  async (err, connection) => {
    if(err){
      console.log(err.message);
      res.json({
        SUCCESS : false,
        MSG_CODE: err.message,
        MSG_TEXT: err.message,
        COL_NAM : ''
      });
      return;
    }
    
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
        connection.rollback((err) => {
          if(err !== null)
            console.log('rollback Error: ' + err);
        })

        doRelease(connection);
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
          connection.commit((err) => {
            if(err !== null)
              console.log('Commit Error: ' + err);
          })
          
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
                  seq      : errSeq.seq,
                  result   : result});
        return;
      }
    }
  }) 
});
 
router.post('/Query', (req, res) => {
  oracleDb.getConnection({
    user         : dbConfig.user,
    password     : dbConfig.password,
    connectString: dbConfig.connectString
  },
  (err, connection) => {
    if(err){
      console.log(err.message);
      return;
    }

    const file = req.body.file;
    let Common;
    try{
      Common = require('./Query/' + file);
    }catch(err){
      console.log(err);
    }

    if(typeof(Common) !== 'function'){
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

    connection.execute(query, (err, result) => {
      if(err){
        console.log(err.message);

        connection.rollback((err) => {
          if(err !== null)
            console.log('rollback Error: ' + err);
        })

        doRelease(connection);

        res.send({
          result  : false,
          data    : null,
          applyRow: 0,
          code    : '',
          message : err
        });

        return;
      }else{
        connection.commit((err) => {
          if(err !== null)
            console.log('Commit Error: ' + err);
        })
      }

      // console.log(result);
      res.send(result);
    })
  })
});

router.post('/QueryTran', (req, res) => {
  oracleDb.getConnection({
    user         : dbConfig.user,
    password     : dbConfig.password,
    connectString: dbConfig.connectString
  },
  (err, connection) => {
    if(err){
      console.log(err.message);
      return;
    }

    const reqGrid      = req.body.grid;
    const reqRowStatus = req.body.rowStatus;
    const reqFile      = req.body.file;
    const reqFn        = req.body.fn;
    const reqParam     = req.body.param;
    const reqSeq       = req.body.seq;

    for(let i = 0; i < reqRowStatus.length; i++){
      let Common;
      try{
        Common = require('./Query/' + reqFile[i]);
      }catch(err){
        console.log(err);
      }
  
      if(typeof(Common) !== 'function'){
        console.log('Wrong file location');
        res.send({
          result  : false,
          grid    : null,
          data    : null,
          applyRow: 0,
          code    : '',
          message : 'Wrong file location'
        });
  
        return;
      }

      const fn = reqFn[i];
      const param = reqParam[i];
      const query = Common(fn, (param !== null && param !== undefined ) && param);
      console.log(query);
  
      connection.execute(query, (err, result) => {
        if(err){
          console.log(err.message);
          connection.rollback((err) => {
            if(err !== null)
              console.log('rollback Error: ' + err);
          })

          doRelease(connection);

          let msg = err;
          if(reqRowStatus[i] === 'I'){
            if(err.errorNum === 1){
              msg = 'MSG03'; // 중복값이 존재합니다.
            }
          }

          res.send({
            result  : false,
            grid    : reqGrid[i],
            data    : null,
            applyRow: (reqSeq !== null && reqSeq !== undefined && reqSeq.length > 0) && reqSeq[i],
            code    : '',
            message : msg
          });

          return;
        }else{
          if(i === reqRowStatus.length - 1){

            let msg = '';
            if(reqRowStatus[i] === 'R'){
              if(result.rows.length === 0){
                msg = 'MSG01';
              }
            }else if(reqRowStatus[i] === 'U' || reqRowStatus[i] === 'D'){
              if(result.rowsAffected === 0){
                msg = 'MSG02'; // '해당건이 없습니다. 다시조회후 처리해주세요.
            
                res.send({
                  result  : false,
                  grid    : reqGrid[i],
                  data    : result,
                  applyRow: 0,
                  code    : '',
                  message : msg
                });
  
                return
              }
            }

            connection.commit((err) => {
              if(err !== null)
                console.log('Commit Error: ' + err);
            })
            
            res.send({
              result  : msg === '' ? true : false,
              grid    : reqGrid[i],
              data    : result,
              applyRow: 0,
              code    : '',
              message : msg
            });
          }
        }
      })
    }
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