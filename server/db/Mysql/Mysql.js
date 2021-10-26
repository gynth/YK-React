const express = require('express');
const router = express.Router();
const dbPool = require('./dbConfig');


router.post('/Query', (req, res) => {
  const scaleNumb = req.body.scaleNumb;
  const detail_subt = req.body.detail_subt;

  dbPool.getConnection((err, connection) => {

    try{
      if(!err){

        const query = ` UPDATE T_SCAL_MSTR ` +
                      `    SET REDUCE_WGT = '${detail_subt}' ` +
                      `  WHERE SCAL_NUMB  = '${scaleNumb}'   ` ;

        connection.query(query, (err, data) => {

          if(data === undefined){
            console.log('data === undefined');
            res.send({
              result  : false,
              data    : null,
              applyRow: 0,
              code    : err.code,
              message : err.sqlMessage 
            });
          }
          else if(!err){
            console.log('data === success');
            res.send({
              result  : true,
              data    : data,
              applyRow: data.affectedRows === undefined ? data.length : data.affectedRows,
              code    : '',
              message : '' 
            });
          }else{ 
            console.log('data === else');
            res.send({
              result  : false,
              data    : null,
              applyRow: data.affectedRows === undefined ? data.length : data.affectedRows,
              code    : err.code,
              message : err.sqlMessage 
            });
          }
        })
        
      }else{
        console.log('connection fail');
        res.send({
          result  : false,
          data    : null,
          applyRow: 0,
          code    : err.syscall,
          message : err.code 
        });
      }
    }catch(err){
      console.log(err);

      res.send({
        result  : false,
        data    : null,
        applyRow: 0,
        code    : err.name,
        message : err.stack
      });
    }finally{
      connection.release();
    }
  });
})

module.exports = router;