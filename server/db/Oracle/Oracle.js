var oracleDb = require('oracledb');
var dbConfig = require('../Oracle/dbConfig');
const express = require('express');
const router = express.Router();

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