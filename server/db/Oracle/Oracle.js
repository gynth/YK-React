var oracleDb = require('oracledb');
var dbConfig = require('../Oracle/dbConfig');
const express = require('express');
const router = express.Router();

const executeSP = async(param) => {

}

router.post('/SPYK', (req, res) => {
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

    const param = req.body.param;
    for(let i = 0; i < param.length; i++){
      let query = param[i].sp;
      let data  = param[i].data;
      data.p_out = { type: oracleDb.STRING, dir: oracleDb.BIND_OUT};
      
      console.log(query, data);
      const result = connection.execute(query, data);
      console.log(result.outBinds);
      if(result.outBinds !== 'OK'){
        doRelease(connection);
        res.json(result.outBinds);
        return;
      }
    }

    connection.commit((err) => {
      if(err !== null)
        console.log('Commit Error: ' + err);
    })

    // const query = Common(fn, param);

    // connection.execute(query, (err, result) => {
    //   if(err){
    //     console.log(err.message);
    //     doRelease(connection);
    //     return;
    //   }else{
    //     connection.commit((err) => {
    //       if(err !== null)
    //         console.log('Commit Error: ' + err);
    //     })
    //   }

    //   // console.log(result);
    //   res.send(result);
    // })
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