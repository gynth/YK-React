const axios = require('axios');
const moment = require('moment');
var edge = require('edge-js');

global.MILESTONE_REPLAY = {};

//#region old
// const oracleQuery = (file, fn, param) => {
//   // const host = 'http://211.231.136.182:3001/Oracle/Query';
//   const host = 'http://ims.yksteel.co.kr:90/WebServer/Oracle/Query';
//   const option = {
//     url   : host,
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Accept': 'application/json'
//     },
//     data: {
//       file,
//       fn,
//       param
//     } 
//   };

//   return axios(option)
//     .then(res => {
//       return res
//     })
//     .catch(err => {
//       console.log(err)
//       return err;
//     })
// }

// const getRecData = async(file, fn, param) => {
//   const result = await oracleQuery(file, fn, param);
//   return result;
// }

// //global.MILESTONE_REPLAY[Guid]이거별로 인터벌을 만들어서처리
// setInterval(async() => {
//   const select = await getRecData('Common/Common', 'ZM_IMS_REC_MAKE', null);
//   if(select.data.rows.length > 0){
//     select.data.rows.forEach(e => {
//       const scaleNumb = e[0];
//       const seq  = e[1];
//       const rec_fr_dttm = moment(e[2]).format('yyyy-MM-DD HH:mm:ss');
//       const rec_to_dttm = moment(e[3]).format('yyyy-MM-DD HH:mm:ss');
//       const Guid = e[4];
//       const Name = e[5];

//       //설정된 메서드가 없으면 생성.
//       if(global.MILESTONE_REPLAY[Guid] === undefined){
//         let Connect = edge.func({
//           assemblyFile:`${__dirname}/Milestone/Milestone.dll`,
//           methodName: 'Connect'
//         });
          
//         Connect([Guid, Guid, 'Start', '', scaleNumb, '', Name], (error, result) => { 
//           if(result[1] === 'Y') {
//             global.MILESTONE_REPLAY[Guid] = {
//               method : Connect,
//               recYn  : 'N'
//             }
//           }
//         })
//       }

//       global.MILESTONE_REPLAY[Guid].method([Guid, Guid, 'Video', '', scaleNumb, '', Name, '', rec_fr_dttm, rec_to_dttm], (error, result) => { 
//         if(result === '0') {
//           getRecData('Common/Common', 'ZM_IMS_REC_DELETE', [{scaleNumb, seq}])
//             .then(e => {
//               console.log(`${scaleNumb} -> 영상저장에 성공 했습니다.`);
//               global.MILESTONE_REPLAY[Guid].recYn = 'N';
//             }).catch(err => {
//               console.log('영상녹화 데이터 삭제에 실패했습니다.');
//             })
//         }else {
//           console.log('영상녹화 파일생성에 실패 했습니다.');
//         }
//       })   
//     });
//   }
// }, 5000);

//#endregion


const OracleServerSP = (param) => {
  for(let j = 0; j < param.length; j++){
    let keys = Object.keys(param[j].data);
    for(let i = 0; i < keys.length; i++){
      if(param[j].data[keys[i]] === null || param[j].data[keys[i]] === undefined){
        param[j].data[keys[i]] = '';
      }
    }
  }
  
  // const host = 'http://ims.yksteel.co.kr:90/WebServer/Oracle/SP';
  const host = 'http://10.10.10.136:3001/Oracle/SP';
  const option = {
    url   : host,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data: {
      param
    } ,
    timeout: 10000
  };

  return axios(option)
    .then(res => {
      return res
    })
    .catch(err => {
      console.log(err)
      return err;
    })
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

  const select = await OracleServerSP(param);
  if(select.data.SUCCESS === 'Y'){
    const ROWS = select.data.ROWS;
    for(let i = 0; i < ROWS.length; i++){
      const scaleNumb   = ROWS[i].SCALENUMB;
      const seq         = ROWS[i].SEQ;
      const rec_fr_dttm = moment(ROWS[i].REC_FR_DTTM).format('yyyy-MM-DD HH:mm:ss');
      const rec_to_dttm = moment(ROWS[i].REC_TO_DTTM).format('yyyy-MM-DD HH:mm:ss');
      const Guid        = ROWS[i].CAMERA_GUID;
      const Name        = ROWS[i].CAMERA_NAME;
 
      //설정된 메서드가 없으면 생성.
      if(global.MILESTONE_REPLAY[Guid] === undefined){
        let Connect = edge.func({
          assemblyFile:`${__dirname}/Milestone/Milestone.dll`,
          methodName: 'Connect'
        });
          
        Connect([Guid, Guid, 'Start', '', scaleNumb, '', Name], (error, result) => { 
          if(result[1] === 'Y') {
            global.MILESTONE_REPLAY[Guid] = {
              method : Connect,
              recYn  : 'N'
            }
          }
        })
      }
      
      global.MILESTONE_REPLAY[Guid].method([Guid, Guid, 'Video', '', scaleNumb, '', Name, '', rec_fr_dttm, rec_to_dttm], (error, result) => { 
        if(result === '0') {

          let param2 = [];
          param2.push({
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
              p_RowStatus    : 'D',
              p_scaleNumb    : scaleNumb,
              p_seq          : seq,
              p_cameraNo     : '',
              p_cameraDevice : '',
              p_cameraName   : '',
              p_UserId       : 'Encoding'
            },
            errSeq: 0
          })
        
          OracleServerSP(param2)
            .then(e => {
              console.log(`${scaleNumb} : 영상녹화 저장에 성공했습니다.`);
              global.MILESTONE_REPLAY[Guid].recYn = 'N';
            }).catch(err => {
              console.log('영상녹화 데이터 삭제에 실패했습니다.');
            })
        }else {
          console.log('영상녹화 파일생성에 실패 했습니다.');
        }
      })
    }
  }
}, 5000);


console.log('Encoding Server Start');

