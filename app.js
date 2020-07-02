var http = require('http'),
    app = require('./config/express')(),
    socketio = require('socket.io');

const server = http.createServer(app);

const io = socketio(server);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// Socket.io Communication
io.on('connection', require('./server/routes/socket'));

// middleware
io.use((socket, next) => {
  let authorization = socket.handshake.headers['authorization'];
  if (authorization === 'clientID123456789') {
    return next();
  }
  return next(new Error('authentication error'));
});
