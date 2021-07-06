const express = require('express');
const router = express.Router();
const axios = require('axios');

//#region YK스틸 웹요청
const yk_req = (request, URL) => {
  let response;
  try{
    response = axios.get(URL, { 

    })
  }catch{

  }

  return response;
}

router.post('/', (req, res) => {
  let URL = `http://tally.yksteel.co.kr/${req.body.addr}`;
  
  yk_req(req, URL).then((response) => {
    res.json(response.data);
  })
});

module.exports = router;