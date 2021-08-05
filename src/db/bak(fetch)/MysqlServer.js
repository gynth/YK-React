export function MysqlServer(call, file, fn, param){
  const host = 'http://211.231.136.182:3001/Mysql/' + call;
  const option = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      file,
      fn,
      param
    })
  };

  return fetch(host,option)
    .then(res => res.json())
    .then(res => res)
    .catch(
      err => {
        console.log(err)
        return(err);
      }
    )
};