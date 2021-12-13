import axios from 'axios';

export function OracleServerQuery(file, fn, param){
  // const host = 'http://211.231.136.182:3001/Oracle/Query';
  // const host = 'http://10.10.10.136:3001/Oracle/Query';
  const host = 'http://ims.yksteel.co.kr:90/WebServer/Oracle/Query'; //김경현11
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
    } ,
    timeout: 30000
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

export function OracleServerQueryTran(grid, rowStatus, file, fn, param, seq){
  // const host = 'http://211.231.136.182:3001/Oracle/QueryTran';
  // const host = 'http://10.10.10.136:3001/Oracle/Query';
  const host = 'http://ims.yksteel.co.kr:90/WebServer/Oracle/QueryTran';
  const option = {
    url   : host,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data: {
      grid,
      rowStatus,
      file,
      fn,
      param,
      seq
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
};

export function OracleServerSP_YN(param){
  // const host = 'http://211.231.136.182:3001/Oracle/SPYK';
  // const host = 'http://10.10.10.136:3001/Oracle/SPYK';
  const host = 'http://ims.yksteel.co.kr:90/WebServer/Oracle/SPYK';
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
};

export function OracleServerSP(param){
  for(let j = 0; j < param.length; j++){
    let keys = Object.keys(param[j].data);
    for(let i = 0; i < keys.length; i++){
      if(param[j].data[keys[i]] === null || param[j].data[keys[i]] === undefined){
        param[j].data[keys[i]] = '';
      }
    }
  }
  
  const host = 'http://ims.yksteel.co.kr:90/WebServer/Oracle/SP';
  // const host = 'http://211.231.136.182:3001/Oracle/SP';
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
};