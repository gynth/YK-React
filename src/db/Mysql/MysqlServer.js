import axios from "axios";

export function MysqlServerQuery(file, fn, param){
  const host = 'http://211.231.136.150:3001/Mysql/Query';
  // const host = 'http://localhost:3001/Mysql/Query';
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
    .then(res => (res))
    .catch(err => {
      console.log(err)
      return err;
    })
};

export function MysqlServerSP(param, gridInfo, mustValue){
  const host = 'http://211.231.136.150:3001/Mysql/SP';
  // const host = 'http://localhost:3001/Mysql/SP';
  const option = {
    url   : host,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data: {
      param,
      gridInfo,
      mustValue
    } 
  };

  return axios(option)
    .then(res => (res))
    .catch(err => {
      console.log(err)
      return err;
    })
};

export function MysqlServerTemp(call, file, fn, param, query){
  const host = 'http://211.231.136.150:8080/mysql/select/';
  // const host = 'http://localhost:8080/mysql/select/';
  const option = {
    url   : host,
    method: 'POST',
    headers: {
      // 'Content-Type': 'application/json',
      // 'Accept': 'application/json'
      // 'Content-Type':'application/x-www-form-urlencoded',
      'Content-Type':'application/json',
      // 'host' : host
    },
    data: {
      qry: query
    }
  };

  return axios(option)
    .then(res => (res))
    .catch(err => {
      console.log(err)
      return err;
    })
};