var mysql = require('mysql');
const dbPool = mysql.createPool({
    connectionLimit: 50,
    host : '10.10.30.11',
    port : 3306,
    user : 'scale',
    password : 'yk',
    database : 'SCALE',
    multipleStatements: true,
    // acquireTimeout: 1000000,
    connectTimeout: 5000, //5초
    dateStrings: 'date'
}); 

module.exports = dbPool;  