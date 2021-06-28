import axios from 'axios';

export function YK_WEB_REQ(addr){
  // const host = 'http://tally.yksteel.co.kr/tally_mstr_wait.jsp';
  const host = 'http://localhost:3001/YK';
  const option = {
    url   : host,
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    data: {
      addr
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
