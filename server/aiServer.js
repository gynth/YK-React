const express = require('express');
const app3128 = express();
const Ai = require('./Ai/ai');
const cors = require('cors');
const axios = require('axios');

// const soap = require('soap'); 

global.REC_SCALENUMB = null;

app3128.use(express.json({
  limit: '100mb'
}));
app3128.use(express.urlencoded({ 
  limit: '100mb',
  extended: false 
})); 
app3128.use(cors()); 

app3128.use('/Ai', Ai);

const port3128 = 3128;
app3128.listen(port3128, () => {
  callLog('AI', `AiServer on port: ${port3128}..`);
});  

const callLog = async(folder, msg) => {
  const host = 'http://localhost:3001/Log';
  // const host = 'http://211.231.136.182:3001/Oracle/SP';
  const option = {
    url   : host,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data: {
      folder,
      msg
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
}