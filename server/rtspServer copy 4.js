var httpAttach = require('http-attach') // useful module for attaching middlewares

var
  http = require('http'),
  Cam = require('onvif').Cam;

new Cam({
  hostname: '10.10.136.127',
  username: 'admin',
  password: 'pass'
}, function(err) {
  this.absoluteMove({x: 1, y: 1, zoom: 1});
  this.getStreamUri({protocol:'RTSP'}, function(err, stream) {
    http.createServer(function (req, res) {
      res.setHeader('Access-Control-Allow-Header', req.headers.origin);
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(
        '<embed type="application/x-vlc-plugin" target="' + stream.uri + '"></embed>'
        );
    }).listen(3000);
  });
});




// .listen(3000);