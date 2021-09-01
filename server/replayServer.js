var httpAttach = require('http-attach') // useful module for attaching middlewares
const fs = require('fs');
const hls = require('hls-server');
var http = require('http');
var url = require('url');
const express = require('express');
const app3003 = express();
const cors = require('cors');

app3003.use(express.json());
app3003.use(cors());  
app3003.post('/File',  (req, res) => {
  console.log('aa');
  res.json('aa');
});

app3003.post('/',  (req, res) => {
  let scaleNumb = req.body.scaleNumb;
  let Name = req.body.Name;
  let resourcePath = `F:/IMS/Replay/${scaleNumb}/${Name}/${scaleNumb}.mp4`;
  
  let stream = fs.createReadStream(resourcePath);
 
  stream.pipe(res);
});

app3003.get('/',  (req, res) => {
  return res.status(200).sendFile(`${__dirname}/index.html`);
});

const port3003 = 3003;
const server = app3003.listen(port3003, function(){
  console.log(`Replay on port: ${port3003}..`)
});

new hls(server, {
  provider: {
    exists: (req, cb) => {
      // const ext = req.url.split('.').pop();

      // if(ext !== 'm3u8' && ext !== 'ts'){
      //   return cb(null, true);
      // }

      fs.access('F:/IMS/Replay' + decodeURIComponent(req.url), fs.constants.F_OK, (err) => {
        if(err){
          return cb(null, false);
        }  
        cb(null, true); 
      });
    },
    getManifestStream: (req, cb) => {
      const stream = fs.createReadStream('F:/IMS/Replay' + decodeURIComponent(req.url));
      cb(null, stream);
    },
    getSegmentStream: (req, cb) => {
      const stream = fs.createReadStream('F:/IMS/Replay' + decodeURIComponent(req.url));
      cb(null, stream);
    }
  }    
})  

function hlsMiddleware (req, res, next) {
  // set your headers here
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Access-Control-Allow-Origin', '*');
  next() 
}

httpAttach(server, hlsMiddleware)



// let downLoadServer = http.createServer(function(request,response){
 
//   try{
//     let scaleNumb = url.parse(request.url, true).query['scaleNumb'];
//     let Name = url.parse(request.url, true).query['cameraName'];
//     let streamYn = url.parse(request.url, true).query['stream'];
//     let requestPath = request.url.substring(0, request.url.indexOf('?'));

//     let resourcePath = `F:/IMS/Replay/${scaleNumb}/${Name}/${requestPath}`;
    
//     // fs.readFile(resourcePath, function(error, data) {
//     //   // request.end(data);
//     //   response.write(data);
//     // });

//     // if(streamYn === 'Y'){
//     //   let stream = fs.createReadStream(resourcePath);
    
//     //   stream.on('data', (movie) => {
//     //     // 3.1. data 이벤트가 발생되면 해당 data를 클라이언트로 전송
//     //     response.write(movie);
//     //   });  
    
//     //   stream.on('end', function () {
//     //     // console.log('end streaming');
//     //     response.end();
//     //   });
       
//     //   stream.on('error', function(err) {
//     //     response.end('500 Internal Server ' + err);
//     //   });
//     // }else{
      
//       let stream = fs.createReadStream(resourcePath);
//       stream.pipe(response);
//       // fs.readFile(resourcePath, function(error, data) {
//       //   // request.end(data);
//       //   response.write(data);
//       // });
//     // }
//   }catch (e){ 
//     response.statusMessage = e; 
//     response.end(e);
//   }
// }); 
// function replayMiddleware (req, res, next) {
//   res.setHeader('Accept-Ranges', 'bytes');
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   next()
// } 
// httpAttach(downLoadServer, replayMiddleware)