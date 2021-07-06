const express = require('express');
const router = express.Router();
const soap = require('soap'); 

// router.get('/', (req, res) => {

//   var url = 'http://www.kobis.or.kr/kobisopenapi/webservice/soap/boxoffice?wsdl';
//   var args = {key     : 'f689d57a2ae72d2cdd97dff4dd0fbe09',
//               targetDt: '20210629'};
//   soap.createClient(url, function(err, client) {
//     // console.log(client);
//       client.searchDailyBoxOfficeList(args, function(err, result) {
//         if(err === null){
//           res.json(result);
//         }else{
//           console.log(err);
//           res.json(null);
//         }
//         // console.log(result);
//       });
//   })
// });

router.get('/', (req, res) => {

  var url = 'https://www.dataaccess.com/webservicesserver/numberconversion.wso?WSDL';
  var args = {dNum     : 10};
  soap.createClient(url, function(err, client) {
    // console.log(client);
      client.NumberToDollars(args, function(err, result) {
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

module.exports = router;