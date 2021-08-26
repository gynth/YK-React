import axios from 'axios';

export function YK_WEB_REQ(addr){
  const host = 'http://10.10.10.136:3001/YK';
  // const host = 'http://211.231.136.150:3001/YK';
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
  const host = 'http://10.10.10.136:3001/YK/DIRECT';
  // const host = 'http://211.231.136.150:3001/YK';
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

export function YK_WEB_REQ_DISP(addr){
  const host = 'http://10.10.10.136:3001/YK/DISP';
  // const host = 'http://211.231.136.150:3001/YK';
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
  const host = `http://10.10.10.136:3002/MILESTONE/LIVE?device=${data['device']}`;
  // const host = `http://211.231.136.150:3002/MILESTONE/LIVE?device=${data['device']}`;
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
  const host = `http://10.10.10.136:3002/MILESTONE/${data['reqAddr']}`;
  // const host = `http://211.231.136.150:3002/MILESTONE/${data['reqAddr']}`;
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
  const host = `http://10.10.10.136:3000/${data['reqAddr']}`;
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
      reqAddr    : data['reqAddr']
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
  const host = `http://10.10.10.136:3002/Token`;
  // const host = `http://211.231.136.150:3002/Token`;
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