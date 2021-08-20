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
  let URL = encodeURI(`http://tally.yksteel.co.kr/ykdev/${req.body.addr}`);
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

module.exports = router;       