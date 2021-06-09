const express = require('express');
const app = express();
const Mysql = require('./db/Mysql/Mysql');
const cors = require('cors');

// const http = require('http');
// const io = require('socket.io');

app.use(express.json());
app.use(cors());

/* Mysql요청 */
app.use('/Mysql', Mysql);

const port = 3001;
app.listen(port, () => {
  console.log(`Listening on port ${port}..`)
});  


// const httpServer = http.createServer(app).listen(3003, () => { 
//   console.log("포트 3003에 연결되었습니다."); 
// });

// const socketServer = io(httpServer); 
// socketServer.on("connection", socket => { 
//   console.log("connect client by Socket.io"); 
// });
