var oracleDb = require('oracledb');
var dbConfig = require('../Oracle/dbConfig');
const express = require('express');
const router = express.Router();

const executeSP = async(connection, query, data) => {
  const result = await connection.execute(query, data);
  return result.outBinds.p_out;
}

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
      
      const result = await executeSP(connection, query, data);
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
    const query = Common(fn, param);

    connection.execute(query, (err, result) => {
      if(err){
        console.log(err.message);
        doRelease(connection);
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

const doRelease = (connection) => {
  connection.close(err => {
    if(err){
      console.log(err.message);
    }
  })
} 

module.exports = router;      