const axios = require('axios');
const moment = require('moment');
var edge = require('edge-js');
var oracleDb = require('oracledb');

(async() => {
  await oracleDb.createPool({
    user         : process.env.NODEORACLEDB_USER || 'YK_IMS',
    password     : process.env.NODEORACLEDB_PASSWORD || 'wjdqhykims',
    connectString: process.env.NODEORACLEDB_CONNECTIONSTRING || '10.10.10.11:1521/PROD',
    poolAlias: 'aipool',
    poolMax       : 20,
    poolMin       : 0
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

  if(RowStatus.indexOf('R') >= 0){
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

global.MILESTONE_REPLAY = {};

const OracleServerSP = async(param) => {
  for(let j = 0; j < param.length; j++){
    let keys = Object.keys(param[j].data);
    for(let i = 0; i < keys.length; i++){
      if(param[j].data[keys[i]] === null || param[j].data[keys[i]] === undefined){
        param[j].data[keys[i]] = '';
      }
    }
  }

  let rtn = {
    SUCCESS: 1
  }

  await oracleDb.getConnection('aipool', async(err, connection) => {
    if(err){
      console.log(err.message);
      return;
    }

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
      // console.log(result)
      if(result.SUCCESS === 'N'){
        connection.rollback((err) => {
          if(err !== null)
            console.log('rollback Error: ' + err);
        })
        doRelease(connection);

        rtn.SUCCESS = result.SUCCESS;
        
      }else{
        if(i === param.length - 1){
          connection.commit((err) => {
            if(err !== null)
              console.log('Commit Error: ' + err);
          })

          doRelease(connection);

          rtn.SUCCESS = result.SUCCESS;
        }
      }
    }
  }) 

  return rtn;
}

setInterval(async() => {
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
      p_RowStatus    : 'R1',
      p_scaleNumb    : '',
      p_seq          : 0,
      p_cameraNo     : '',
      p_cameraDevice : '',
      p_cameraName   : '',
      p_UserId       : 'Encoding'
    },
    errSeq: 0
  })

  OracleServerSP(param).then(e => console.log(e))

  // const select = OracleServerSP(param);
  // console.log(select)
  // if(select.data.SUCCESS === 'Y'){
  //   const ROWS = select.data.ROWS;
  //   for(let i = 0; i < ROWS.length; i++){
  //     const scaleNumb   = ROWS[i].SCALENUMB;

  //     const seq         = ROWS[i].SEQ;
  //     const rec_fr_dttm = moment(ROWS[i].REC_FR_DTTM).format('yyyy-MM-DD HH:mm:ss');
  //     const rec_to_dttm = moment(ROWS[i].REC_TO_DTTM).format('yyyy-MM-DD HH:mm:ss');
  //     const Guid        = ROWS[i].CAMERA_GUID;
  //     const Name        = ROWS[i].CAMERA_NAME;
  
  //     //설정된 메서드가 없으면 생성.
  //     if(global.MILESTONE_REPLAY[Guid] === undefined){
  //       let Connect = edge.func({
  //         assemblyFile:`${__dirname}/Milestone/Milestone.dll`,
  //         methodName: 'Connect'
  //       });
          
  //       Connect([Guid, Guid, 'Start', '', scaleNumb, '', Name], (error, result) => { 
  //         if(result[1] === 'Y') {
  //           global.MILESTONE_REPLAY[Guid] = {
  //             method : Connect,
  //             recYn  : 'N'
  //           }
  //         }
  //       })
  //     }
      
  //     global.MILESTONE_REPLAY[Guid].method([Guid, Guid, 'Video', '', scaleNumb, '', Name, '', rec_fr_dttm, rec_to_dttm], (error, result) => { 
  //       if(result === '0') {

  //         let param2 = [];
  //         param2.push({
  //           sp   : `begin 
  //                     SP_ZM_IMS_REC(
  //                       :p_RowStatus,
  //                       :p_scaleNumb,
  //                       :p_seq,
  //                       :p_cameraNo,
  //                       :p_cameraDevice,
  //                       :p_cameraName,
  //                       :p_UserId,
                        
  //                       :p_select,
  //                       :p_SUCCESS,
  //                       :p_MSG_CODE,
  //                       :p_MSG_TEXT,
  //                       :p_COL_NAM
  //                     );
  //                   end;
  //                   `,
  //           data : {
  //             p_RowStatus    : 'D',
  //             p_scaleNumb    : scaleNumb,
  //             p_seq          : seq,
  //             p_cameraNo     : '',
  //             p_cameraDevice : '',
  //             p_cameraName   : '',
  //             p_UserId       : 'Encoding'
  //           },
  //           errSeq: 0
  //         })
        
  //         OracleServerSP(param2)
  //           .then(e => {
  //             console.log(`${scaleNumb} : 영상녹화 저장에 성공했습니다.`);
  //           }).catch(err => {
  //             console.log('영상녹화 데이터 삭제에 실패했습니다.');
  //           })
  //       }else {
  //         console.log('영상녹화 파일생성에 실패 했습니다.');

  //         let param2 = [];
  //         param2.push({
  //           sp   : `begin 
  //                     SP_ZM_IMS_REC(
  //                       :p_RowStatus,
  //                       :p_scaleNumb,
  //                       :p_seq,
  //                       :p_cameraNo,
  //                       :p_cameraDevice,
  //                       :p_cameraName,
  //                       :p_UserId,
                        
  //                       :p_select,
  //                       :p_SUCCESS,
  //                       :p_MSG_CODE,
  //                       :p_MSG_TEXT,
  //                       :p_COL_NAM
  //                     );
  //                   end;
  //                   `,
  //           data : {
  //             p_RowStatus    : 'D2',
  //             p_scaleNumb    : scaleNumb,
  //             p_seq          : seq,
  //             p_cameraNo     : '',
  //             p_cameraDevice : '',
  //             p_cameraName   : '',
  //             p_UserId       : 'Encoding'
  //           },
  //           errSeq: 0
  //         })
        
  //         OracleServerSP(param2)
  //           .then(e => {
  //             console.log(`${scaleNumb} : 영상녹화 실패 삭제.`);
  //           }).catch(err => {
  //             console.log('영상녹화실패 삭제에 실패했습니다.');
  //           })
  //       }
  //     })
  //   }
  // }
}, 5000);


let REC_SCALENUMB = [];
setInterval(async() => {
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
      p_RowStatus    : 'R3',
      p_scaleNumb    : '',
      p_seq          : 0,
      p_cameraNo     : '',
      p_cameraDevice : '',
      p_cameraName   : '',
      p_UserId       : 'Encoding'
    },
    errSeq: 0
  })

  const select = await OracleServerSP(param);
  // if(select.data.SUCCESS === 'Y'){
    
  //   const ROWS = select.data.ROWS;
  //   for(let i = 0; i < ROWS.length; i++){
  //     const scaleNumb = ROWS[i].SCALENUMB;
  //     const oldData = REC_SCALENUMB.find(e => e === scaleNumb);
  //     if(!oldData){
  //       REC_SCALENUMB.push(scaleNumb);
  //     }
  //   }

  //   for(let i = 0; i < REC_SCALENUMB.length; i++){
  //     const scaleNumb = REC_SCALENUMB[i];
  //     const newData = ROWS.find(e => e.SCALENUMB === scaleNumb);

  //     if(!newData){
  //       REC_SCALENUMB = REC_SCALENUMB.filter(e => e !== scaleNumb);
  //     }
  //   }
  // }else{
  //   REC_SCALENUMB = [];
  // }

  // const host = 'http://10.10.10.136:3001/Ai/GetRecodingList';
  // const option = {
  //   url   : host,
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Accept': 'application/json'
  //   },
  //   data: {
  //     REC_SCALENUMB
  //   } ,
  //   timeout: 10000
  // };

  // return axios(option)
  //   .then(res => {
  //     return res
  //   })
  //   .catch(err => {
  //     console.log(err)
  //     return err;
  //   })
}, 5000);


const doRelease = async (connection) => {
  // await connection.release(err => {
  await connection.close(err => {
    if(err){
      console.log(err.message);
    }
  })
} 

console.log('Encoding Server Start');

