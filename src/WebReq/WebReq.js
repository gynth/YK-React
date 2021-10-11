import axios from 'axios';

export function AITEST(Count, Result){
  // const host = 'http://211.231.136.182:3001/YK';
  const host = 'http://ims.yksteel.co.kr:90/WebServer/AiResult';
  const option = {
    url   : host,
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    data: {
      Count,
      Result
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

export function ReRec(scaleNumb){
  // const host = 'http://211.231.136.182:3001/YK';
  const host = 'http://ims.yksteel.co.kr:90/WebServer/ReRec';
  const option = {
    url   : host,
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    data: {
      scaleNumb
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

export function RecodingList(){
  // const host = 'http://211.231.136.182:3001/YK';
  const host = 'http://ims.yksteel.co.kr:90/WebServer/RecodingList';
  const option = {
    url   : host,
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    data: {
      
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

export function YK_WEB_REQ(addr){
  // const host = 'http://211.231.136.182:3001/YK';
  const host = 'http://ims.yksteel.co.kr:90/WebServer/YK';
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

export function YK_WEB_REQ_DIRECT(addr){
  // const host = 'http://211.231.136.182:3001/YK/DIRECT';
  const host = 'http://ims.yksteel.co.kr:90/WebServer/YK/DIRECT';
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

export function YK_WEB_REQ_DIRECT2(addr, scaleNumb){
  // const host = 'http://211.231.136.182:3001/YK/DIRECT';
  const host = 'http://ims.yksteel.co.kr:90/WebServer/YK/DIRECT';
  const option = {
    url   : host,
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    data: {
      addr,
      scaleNumb
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

export function YK_WEB_REQ_RAIN (){
  // const host = 'http://211.231.136.182:3001/YK/Rain';
  const host = 'http://ims.yksteel.co.kr:90/WebServer/YK/Rain';
  const option = {
    url   : host,
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    // data: {
    //   addr
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

export function YK_WEB_REQ_DISP(addr){
  // const host = 'http://211.231.136.182:3001/YK/DISP';
  const host = 'http://ims.yksteel.co.kr:90/WebServer/YK/DISP';
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

export function MILESTONE_LIVE(data) {
  // const host = `http://211.231.136.182:3002/MILESTONE/LIVE?device=${data['device']}`;
  const host = `http://ims.yksteel.co.kr:90/WebServer/MILESTONE/LIVE?device=${data['device']}`;
  const option = {
    url   : host,
    method: 'GET',
    // headers: {
    //   'Access-Control-Allow-Origin': '*'
    // },
    data: {
      // device: data['device']
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

export function MILESTONE(data){
  // const host = `http://211.231.136.182:3002/MILESTONE/${data['reqAddr']}`;
  const host = `http://ims.yksteel.co.kr:90/WebServer/MILESTONE/${data['reqAddr']}`;
  const option = {
    url   : host,
    method: 'POST',
    // headers: {
    //   'Access-Control-Allow-Origin': '*'
    // },
    data: {
      reqAddr    : data['reqAddr'],
      MilestoneIP: data['MilestoneIP'],
      token      : data['token'],
      device     : data['device'],
      ip         : data['ip'],
      maxWidth   : data['maxWidth'], 
      maxHeight  : data['maxHeight'],
      ptz        : data['ptz'],
      scaleNo    : data['scaleNo'],
      recOwner   : data['recOwner'],
      streamUrl  : data['streamUrl'],
      port       : data['port'],
      cameraName : data['cameraName'],
      recYn      : data['recYn']
    },
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

export function RTSP(data){
  // const host = `http://10.10.10.136:3000/${data['reqAddr']}`;
  const host = `http://ims.yksteel.co.kr:90/WebServer/${data['reqAddr']}`;
  const option = {
    url   : host,
    method: 'POST',
    // headers: {
    //   'Access-Control-Allow-Origin': '*'
    // },
    data: {
      device     : data['device'],
      streamUrl  : data['streamUrl'],
      port       : data['port'],
      reqAddr    : data['reqAddr'],
      width      : data['width'],
      height     : data['height'],
      fps        : data['fps'],
      client     : data['client'],
      canvas     : data['canvas']
    },
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

export function TOKEN(data){
  // const host = `http://211.231.136.182:3002/Token`;
  const host = `http://ims.yksteel.co.kr:90/WebServer/Token`;
  const option = {
    url   : host,
    method: 'POST',
    // headers: {
    //   'Access-Control-Allow-Origin': '*'
    // },
    data: {

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