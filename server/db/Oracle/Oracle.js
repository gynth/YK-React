// var oracleDb = require('oracledb');
// var dbConfig = require('../Oracle/dbConfig');
// const express = require('express');
// const router = express.Router();

// router.post('/Query', (req, res) => {
//   oracleDb.getConnection({
//     user         : dbConfig.user,
//     password     : dbConfig.password,
//     connectString: dbConfig.connectString
//   },
//   (err, connection) => {
//     if(err){
//       console.log(err.message);
//       return;
//     }

//     var query = `select * from zm_ims_rec`;

//     connection.execute(query, (err, result) => {
//       if(err){
//         console.log(err.message);
//         doRelease(connection);
//         return;
//       }

//       console.log(result);
//       res.send(result);
//     })
//   })
// });

// const doRelease = (connection) => {
//   connection.close(err => {
//     if(err){
//       console.log(err.message);
//     }
//   })
// } 

// module.exports = router;      