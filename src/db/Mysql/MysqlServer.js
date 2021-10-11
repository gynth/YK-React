import axios from "axios";

export function MysqlServerQuery(scaleNumb, detail_subt){
  const host = 'http://ims.yksteel.co.kr:90/WebServer/Mysql/Query';
  // const host = 'http://10.10.10.136:3001/Mysql/Query';
  const option = {
    url   : host,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data: {
      scaleNumb,
      detail_subt
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
};