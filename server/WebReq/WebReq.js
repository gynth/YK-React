const express = require('express');
const router = express.Router();
const axios = require('axios');

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

router.post('/Rain', (req, res) => {
  const host = `http://apis.data.go.kr/6260000/BusanRainfalldepthInfoService/getRainfallInfo?` +
  `serviceKey=O%2F9eo84VDzROhcmBNa%2B1zTS2hP8rVKtuKRfa2H93v8n4ot43RLo36CUx4X%2BV8%2B9ciQ4hJoZnTJpeB96XGiGE0Q%3D%3D&` +
  `numOfRows=50&` +
  `pageNo=1&` +
  `resultType=json`;
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
      res.json(result.data)
    })
    .catch(err => {
      res.json(err)
    })
})

module.exports = router;       