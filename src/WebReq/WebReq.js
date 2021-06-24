import axios from 'axios';

export function tally_mstr_wait(){
  const host = 'http://tally.yksteel.co.kr/tally_mstr_wait.jsp';
  // const host = 'http://211.95.111.139:80/tally_mstr_wait.jsp';
  const option = {
    url   : host,
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    // data: {
    //   file,
    //   fn,
    //   param
    // } 
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
