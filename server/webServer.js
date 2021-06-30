const express = require('express');
const app = express();
const router = express.Router();
const Mysql = require('./db/Mysql/Mysql');
const cors = require('cors');
const axios = require('axios');
const soap = require('soap');

// const http = require('http');
// const io = require('socket.io');

app.use(express.json());
app.use(cors());

/* Mysql요청 */
app.use('/Mysql', Mysql);

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

app.post('/YK', (req, res) => {
  let URL = `http://tally.yksteel.co.kr/${req.body.addr}`;
  
  yk_req(req, URL).then((response) => {
    res.json(response.data);
  })
});
//#endregion

//#region YK스틸 MILESTONE
app.get('/MILESTONE', (req, res) => {

  // var soap = require('soap');
  var url = 'http://www.kobis.or.kr/kobisopenapi/webservice/soap/boxoffice?wsdl';
  var args = {key     : 'f689d57a2ae72d2cdd97dff4dd0fbe09',
              targetDt: '20210629'};
  soap.createClient(url, function(err, client) {
    // console.log(client);
      client.searchDailyBoxOfficeList(args, function(err, result) {
        if(err === null){
          res.json(result);
        }else{
          console.log(err);
          res.json(null);
        }
        // console.log(result);
      });
  })
});
//#endregion

const port = 3001;
app.listen(port, () => {
  console.log(`Listening on port ${port}..`)
});  