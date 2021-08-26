var httpAttach = require('http-attach') // useful module for attaching middlewares
const fs = require('fs');
// const hls = require('hls-server');

var http = require('http');
var url = require('url');

let server = http.createServer(function(request,response){
 
  try{
    let scaleNumb = url.parse(request.url, true).query['scaleNumb'];
    let Name = url.parse(request.url, true).query['cameraName'];
    let streamYn = url.parse(request.url, true).query['stream'];
    let requestPath = request.url.substring(0, request.url.indexOf('?'));

    let resourcePath = `F:/IMS/Replay/${scaleNumb}/${Name}/${requestPath}`;
    
    // fs.readFile(resourcePath, function(error, data) {
    //   // request.end(data);
    //   response.write(data);
    // });

    if(streamYn === 'Y'){
      let stream = fs.createReadStream(resourcePath);
    
      stream.on('data', (movie) => {
        // 3.1. data 이벤트가 발생되면 해당 data를 클라이언트로 전송
        response.write(movie);
      });  
    
      stream.on('end', function () {
        // console.log('end streaming');
        response.end();
      });
       
      stream.on('error', function(err) {
        response.end('500 Internal Server ' + err);
      });
    }else{
      
      let stream = fs.createReadStream(resourcePath);
      stream.pipe(response);
      // fs.readFile(resourcePath, function(error, data) {
      //   // request.end(data);
      //   response.write(data);
      // });
    }
  }catch (e){ 
    response.statusMessage = e; 
    response.end(e);
  }
}); 
  
const port3003 = 3003;
server.listen(port3003, function(){
  console.log(`Replay on port: ${port3003}..`)
});
function replayMiddleware (req, res, next) {
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Access-Control-Allow-Origin', '*');
  next()
} 
httpAttach(server, replayMiddleware)