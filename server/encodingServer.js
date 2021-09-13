const axios = require('axios');
const moment = require('moment');
var edge = require('edge-js');

global.MILESTONE_REPLAY = {};

const oracleQuery = (file, fn, param) => {
  // const host = 'http://211.231.136.182:3001/Oracle/Query';
  // const host = 'http://10.10.10.136:3001/Oracle/Query';
  const host = 'http://ims.yksteel.co.kr:90/WebServer/Oracle/Query';
  const option = {
    url   : host,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data: {
      file,
      fn,
      param
    } 
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

const getRecData = async(file, fn, param) => {
  const result = await oracleQuery(file, fn, param);
  return result;
}

//global.MILESTONE_REPLAY[Guid]이거별로 인터벌을 만들어서처리
setInterval(async() => {
  const select = await getRecData('Common/Common', 'ZM_IMS_REC_MAKE', null);
  if(select.data.rows.length > 0){
    select.data.rows.forEach(e => {
      const scaleNumb = e[0];
      const seq  = e[1];
      const rec_fr_dttm = moment(e[2]).format('yyyy-MM-DD HH:mm:ss');
      const rec_to_dttm = moment(e[3]).format('yyyy-MM-DD HH:mm:ss');
      const Guid = e[4];
      const Name = e[5];

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
          getRecData('Common/Common', 'ZM_IMS_REC_DELETE', [{scaleNumb, seq}])
            .then(e => {
              console.log(`${scaleNumb} -> 영상저장에 성공 했습니다.`);
              global.MILESTONE_REPLAY[Guid].recYn = 'N';
            }).catch(err => {
              console.log('영상녹화 데이터 삭제에 실패했습니다.');
            })
        }else {
          console.log('영상녹화 파일생성에 실패 했습니다.');
        }
      })   
    });
  }
}, 5000);



console.log('Encoding Server Start');

