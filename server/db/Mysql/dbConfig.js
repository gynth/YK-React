var mysql = require('mysql');
const dbPool = mysql.createPool({
    connectionLimit: 50,
    //기본10초 connectTimeout 
    host : '211.231.139.242',
    port : 33006,
    user : 'team2',
    password : 'dk1234',
    database : '2crm_data',
    multipleStatements: true,
    // acquireTimeout: 1000000,
    connectTimeout: 5000, //5초
    dateStrings: 'date'
}); 

module.exports = dbPool;  