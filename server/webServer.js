const express = require('express');
const app = express();
const router = express.Router();
const Mysql = require('./db/Mysql/Mysql');
const cors = require('cors');
const axios = require('axios');

// const http = require('http');
// const io = require('socket.io');

app.use(express.json());
app.use(cors());

/* Mysql요청 */
app.use('/Mysql', Mysql);

// YK스틸 웹요청
const yk_req = (request, URL) => {
  let response;
  try{
    response = axios.get(URL, {

    })
  }catch{

  }

  return response;
}
// const yk_req = async(request, URL) => {
//   let response;
//   try{
//     response = await axios.get(URL, {

//     })
//   }catch{

//   }

//   return response;
// }

// app.get('/YK', (req, res) => {
//   console.log(req.body);
//   yk_req(req).then((response) => {
//     res.json(response.data);
//   })
// });

app.post('/YK', (req, res) => {
  let URL = `http://tally.yksteel.co.kr/${req.body.addr}`;
  
  yk_req(req, URL).then((response) => {
    res.json(response.data);
  })
});

const port = 3001;
app.listen(port, () => {
  console.log(`Listening on port ${port}..`)
});  