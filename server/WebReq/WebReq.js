const express = require('express');
const router = express.Router();
const axios = require('axios');
const moment = require('moment');

//#region YK스틸 웹요청
const yk_req = (request, URL) => {
  let response;
  try{
    response = axios.get(URL, { 

    })
  }catch(e){

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
  let dt = moment(new Date()).subtract(5, 'minute');
  const date = moment(dt).format('YYYYMMDDHHmm');
  const time = date.substr(8, 4);


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

      console.log(`Rain: ${global.RAIN}mm`)
    })
    .catch(err => {
      console.log(err)
      console.log('Raint Error')
      // console.log(err)
      // global.RAIN = 0;
    })
}, 60000 * 5)/////
// }, 6000)

router.post('/Rain', (req, res) => {
    res.json(global.RAIN)
})

module.exports = router;       