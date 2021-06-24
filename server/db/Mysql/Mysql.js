const express = require('express');
const router = express.Router();
const dbPool = require('./dbConfig');

router.get('/', (req, res) => {
  res.send({data: 'hello world GET'});
})

router.post('/SP', (req, res) => {
  const param = req.body.param;
  const gridInfo = req.body.gridInfo;

  dbPool.getConnection((err, connection) => {
    if(!err){

      const queryList = [];
      
      if(gridInfo === undefined){
        
        for(let i = 0; i < param.length; i++){
          const keys = Object.keys(param[0]);
          
          // let query = `
          // SET @p_SUCCESS  = false;
          // SET @p_MSG_CODE = '';
          // SET @p_MSG_TEXT = '';
          // SET @p_COL_NAM  = '';
          // CALL ${param[i].SP} ('${param[i].ROWSTATUS}'`;

          let query = `
          CALL ${param[i].SP} ('${param[i].ROWSTATUS}'`;
      
          keys.forEach(e => {
            if(e !== 'SP' && e !== 'ROWSTATUS'){
              if(typeof(param[i][e]) === 'string')
                query += `,'${param[i][e]}' `
              else
                query += `,${param[i][e]} `
            }
          }) 

          query += ',@p_SUCCESS, @p_MSG_CODE, @p_MSG_TEXT, @p_COL_NAM); SELECT @p_SUCCESS, @p_MSG_CODE, @p_MSG_TEXT, @p_COL_NAM;';
          queryList[i] = {query};
        }
      }else{
          for(let i = 0; i < gridInfo.length; i++){
            const Keys = Object.keys(gridInfo[i]);
            
            let query = `
            SET @p_SUCCESS  = false;
            SET @p_MSG_CODE = '';
            SET @p_MSG_TEXT = '';
            SET @p_COL_NAM  = '';
            CALL ${gridInfo[i].SP} ('${gridInfo[i].rowStatus}'`;
    
            for(let k = 0; k < Keys.length; k++){
              if(Keys[k] !== 'grid' && Keys[k] !== 'SP' && Keys[k] !== 'rowStatus' && Keys[k] !== 'rowKey'){
                const key = Keys[k];
                
                let value = gridInfo[i][key];
                query += `,${value} `;
              }
            }

            query += ',@p_SUCCESS, @p_MSG_CODE, @p_MSG_TEXT, @p_COL_NAM); SELECT @p_SUCCESS, @p_MSG_CODE, @p_MSG_TEXT, @p_COL_NAM;';
            queryList[i] = {query,
                            ROW_KEY : gridInfo[i].rowKey
                           };
          }
      
          if(queryList.length === 0){
            res.send({
              result  : false,
              data    : null,
              applyRow: 0,    
              MSG_CODE: 'NO MOD',
              MSG_TEXT: '추가되거나 수정된건이 없습니다.',
              ROW_KEY : 0
            });
          }
      }
      
      connection.beginTransaction();

      for(let i = 0; i < queryList.length; i++){
          connection.query(queryList[i]['query'], (queryErr, data) => {
            try{
              const ROW_KEY = queryList[i]['ROW_KEY'];
              
              if(queryErr !== null){
                console.log(queryErr);

                res.send({
                  result  : false,
                  data    : null,
                  applyRow: 0,    
                  MSG_CODE: queryErr.sqlState,
                  MSG_TEXT: queryErr.sqlMessage,
                  ROW_KEY
                });
          
                connection.rollback();

                return;
              }
              
              const SUCCESS = data[data.length - 1][0]['@p_SUCCESS'];
              const MSG_CODE = data[data.length - 1][0]['@p_MSG_CODE'];
              const MSG_TEXT = data[data.length - 1][0]['@p_MSG_TEXT'];
              const COL_NAM = data[data.length - 1][0]['@p_COL_NAM'];
              const RowDataPacket = data.filter(e => (Array.isArray(e)))

              if(SUCCESS === 'Y'){
                if(i === (queryList.length - 1)){
                  res.send({
                    result  : true,
                    data    : RowDataPacket.length > 1 && data[0],
                    applyRow: RowDataPacket.length > 1 && data[0].length,
                    MSG_CODE,
                    MSG_TEXT,  
                    COL_NAM,
                    ROW_KEY 
                  });
          
                  connection.commit(); 
                }
              }else{
                console.log(queryList[i]['query']);
                res.send({
                  result  : false,
                  data    : null,
                  applyRow: 0,    
                  MSG_CODE,
                  MSG_TEXT: (RowDataPacket.length === 1 || RowDataPacket[0].length === 0) ? MSG_TEXT : RowDataPacket[0][0].Message,
                  COL_NAM,
                  ROW_KEY
                });
          
                connection.rollback(); 
                return;
              } 
            }catch(err){
              console.log(err);

              res.send({
                result  : false,
                data    : null,
                applyRow: 0,    
                MSG_CODE: err,
                MSG_TEXT: err,
                ROW_KEY : 0
              });
        
              connection.rollback();
            }
          })
      };

      connection.release();
    }else{
      res.send({
        result  : false,
        data    : null,
        applyRow: 0,
        MSG_CODE: err.syscall,
        MSG_TEXT: err.code,
        column  : '',
        ROW_KEY : 0
      });
    }
  });
})

router.post('/Query', (req, res) => {
  
  console.log('connection Wating');

  dbPool.getConnection((err, connection) => {
    console.log(dbPool._allConnections.length);

    try{
      if(!err){
        console.log('connection success');

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

        connection.beginTransaction();
        connection.query(query, (err, data) => {
          console.log(query);

          if(data === undefined){
            console.log('data === undefined');
            res.send({
              result  : false,
              data    : null,
              applyRow: 0,
              code    : err.code,
              message : err.sqlMessage 
            });
    
            connection.rollback();
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
    
            connection.commit();
          }else{ 
            console.log('data === else');
            res.send({
              result  : false,
              data    : null,
              applyRow: data.affectedRows === undefined ? data.length : data.affectedRows,
              code    : err.code,
              message : err.sqlMessage 
            });
    
            connection.rollback();
          }
        })
        
        connection.release();
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
    }
  });
})

module.exports = router;