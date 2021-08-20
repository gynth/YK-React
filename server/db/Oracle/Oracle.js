
// const oracledb = require('oracledb');
// var dbConfig = require('../Oracle/dbConfig');
// const express = require('express');
// const router = express.Router();

// oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// // router.post('/Query', (req, res) => {
//   run();
// // });


// async function run() {

//   oracledb.getConnection({
//         user         : dbConfig.user,
//         password     : dbConfig.password,
//         connectString: dbConfig.connectString
//       },
//       (err, connection) => {
//         if(err){
//           console.log(err.message);
//           return;
//         }
    
//         var query = `select * from zm_ims_rec`;
    
//         connection.execute(query, (err, result) => {
//           if(err){
//             console.log(err.message);
//             // doRelease(connection);
//             return;
//           }
    
//           console.log(result);
//           // res.send(result);
//         })
//       })





  // let connection;

  // try {
  //   connection = await oracledb.getConnection( {
  //     user          : "YK_IMS",
  //     password      : "wjdqhykims",
  //     connectString : "10.10.10.12:1527/YKIMS"
  //   });

  //   const result = await connection.execute(
  //     `select * from zm_ims_rec`,
  //     [103],  // bind value for :id
  //   );
  //   console.log(result.rows);

  // } catch (err) {
  //   console.error(err);
  // } finally {
  //   if (connection) {
  //     try {
  //       await connection.close();
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }
  // }
// }




var oracleDb = require('oracledb');
var dbConfig = require('../Oracle/dbConfig');
const express = require('express');
const router = express.Router();

router.post('/Query', (req, res) => {
  oracleDb.getConnection({
    user         : dbConfig.user,
    password     : dbConfig.password,
    connectString: dbConfig.connectString
  },
  (err, connection) => {
    if(err){
      console.log(err.message);
      return;
    }

    var query = `select * from zm_ims_rec`;

    connection.execute(query, (err, result) => {
      if(err){
        console.log(err.message);
        doRelease(connection);
        return;
      }

      console.log(result);
      res.send(result);
    })
  })
});

const doRelease = (connection) => {
  connection.close(err => {
    if(err){
      console.log(err.message);
    }
  })
} 

module.exports = router;      