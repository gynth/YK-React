const express = require('express');
const router = express.Router();
const axios = require('axios');
const moment = require('moment');

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

//#region YK스틸 웹요청
const yk_req = (request, URL) => {
  let response;
  try{
    response = axios.get(URL, { 

    })
  }catch(e){
    callLog('WebReq', `yk_req: ${e}`);
  }

  return response;
}

router.post('/', (req, res) => {
  let URL = encodeURI(`http://tally.yksteel.co.kr/ims/${req.body.addr}`);
  // let URL = `http://tally.yksteel.co.kr/${req.body.addr}`;
  
  
  yk_req(req, URL)
    .then((response) => {
      res.json(response.data);
    })
    .catch(err => {
      // console.log(err);
      callLog('WebReq', `/: ${err}`);
      res.json(err);
    })
});

router.post('/DIRECT', (req, res) => {
  let URL = encodeURI(req.body.addr);
  
  yk_req(req, URL)
    .then((response, err) => {
      res.json(response.data);
    })
    .catch(err => {
      // console.log(err);
      callLog('WebReq', `DIRECT: ${err}`);
      res.json(err);
    })
}); 

var parser = require('fast-xml-parser');
var he = require('he'); 
var options = { 
  attributeNamePrefix : "@_", 
  attrNodeName: "attr", 
  textNodeName : "#text", 
  ignoreAttributes : true, 
  ignoreNameSpace : false, 
  allowBooleanAttributes : false, 
  parseNodeValue : true, 
  parseAttributeValue : false, 
  trimValues: true, 
  cdataTagName: "__cdata", 
  cdataPositionChar: "\\c", 
  parseTrueNumberOnly: false, 
  arrayMode: false, 
  attrValueProcessor: (val, attrName) => 
    he.decode(val, {isAttributeValue: true}),
    tagValueProcessor : (val, tagName) => he.decode(val), 
    stopNodes: ["parse-me-as-string"] 
  };

setInterval(e => {
  let now = new Date();
  let chkMinute = moment(now).format('mm');
  let dt;
  let date;
  let time;

  //현재시간이 40분 이전이면 1시간전 정각시간으로
  //40분 초과이면 현재시간으로 계산
  //기상청에서 40분 이후로 데이터를 보냄
  if((chkMinute * 1) <= 40){
    dt = moment(now).subtract(1, 'hour');
    date = moment(dt).format('YYYYMMDDHH59');
    time = date.substr(8, 4);
    callLog('WebReq', `bef 40 ${date}, ${time}`);
  }else{
    dt = moment(now).subtract(1, 'minute');
    date = moment(dt).format('YYYYMMDDHHmm');
    time = date.substr(8, 4);
    callLog('WebReq', `aft 40 ${date}, ${time}`);
  }

  const host = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?` +
  `serviceKey=O%2F9eo84VDzROhcmBNa%2B1zTS2hP8rVKtuKRfa2H93v8n4ot43RLo36CUx4X%2BV8%2B9ciQ4hJoZnTJpeB96XGiGE0Q%3D%3D&` +
  `pageNo=1&` +
  `numOfRows=10&` +
  `base_date=${date.substring(0, 8)}&` +
  `base_time=${time}&` +
  `nx=96&ny=73`;

  const option = {
    url   : host,
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    // data: {
    //   addr
    // } 
  };

  axios(option)
    .then(result => {
      const xml = result.data;

      if( parser.validate(xml) === true) { 
        var jsonObj = parser.parse(xml,options); 
        const rain = jsonObj.response.body.items.item.filter(e => e.category === 'RN1');

        global.RAIN = rain[0].obsrValue;
      }else{
        global.RAIN = 0;
      }

      callLog('WebReq', `Rain1: ${global.RAIN}mm`);
    })
    .catch(err => {
      console.log(err)
      callLog('WebReq', `Rain2: ${err}mm`);
      // console.log(err)
      // global.RAIN = 0;
    })
}, 60000)/////
// }, 6000)

router.post('/Rain', (req, res) => {
    res.json(global.RAIN)
})

module.exports = router;       