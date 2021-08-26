import axios from 'axios';

export function OracleServerQuery(file, fn, param){
  // const host = 'http://211.231.136.182:3001/Oracle/Query';
  const host = 'http://10.10.10.136:3001/Oracle/Query';
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
};