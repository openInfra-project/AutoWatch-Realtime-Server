const app = require("express")();
//테스트용 https서버
//실제로 배포시 https로 배포해야한다.
const https = require('https')

//테스트용 http
const http = require('http')

const fs = require('fs');
const { connect } = require("http2");
const options = {
    key: fs.readFileSync('./private.pem'),
    cert: fs.readFileSync('./public.pem')
}
// const httpsServer = https.createServer(options,app)
const httpServer = http.createServer(options,app)
const io = require('socket.io')(httpServer,{
  cors:{
    origin:"*",
    credential:true
  }
})
// io.sockets.on('connection', (socket) => {
//   socket.on('disconnect', () => {
//     console.log('disconnected');
//   });
// });
var room_info = ""
io.sockets.on('connection',(socket)=> {
  //request랑 response 아직 구현 안해씀
  socket.on('request',(room)=> {
    socket.broadcast.emit("getRequest",room)
    room_info =  room
  })
  socket.on('response',(room,isGrant)=> {
    if(isGrant){
      socket.broadcast.emit('getResponse',room.isGrant)
      socket.emit('enter',room)
    }
  })
  //-------------------------------------------
  socket.on('connect',()=> {
    socket.emit("onCollabo",socket.id)
  })
  socket.on('collabo',(room)=> {
    socket.emit('create or join',room)
    console.log('Attempted to create or join room',room)
  })
  socket.on('message',(message)=> {
    console.log("Client said: ",message)
    socket.broadcast.emit('message',message)
  })
  var numClients = {}
  socket.on('create or join' , (room)=> {
    // console.log("Received request to create or join room " + room)
    // var clientsInRoom = io.sockets.adapter.rooms[room]
    // console.log("room name:"+room)
    // console.log("TestRESULT"+io.sockets.adapter.rooms[room])
    // console.log("TEST RESULT :"+io.sockets.adapter.rooms)
    // var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length:0
    // console.log('Room '+room+' now has' + numClients + ' clinet(s)')
    socket.join(room)
    socket.room = room
    if(numClients[room]==undefined) {
      numClients[room] = 1
      console.log("client number:"+numClients[room])
      console.log('Client ID ' + socket.id + ' created room ' + room);
      socket.emit('created',room,socket.id)
    }else {
      numClients[room]++;
      console.log("client number:"+numClients[room])
      console.log('Client ID ' + socket.id + ' created room ' + room);
      io.sockets.in(room).emit('join',room)
      socket.emit('joined', room, socket.id);
    }
    // if(numClients===0) {
    //   socket.join(room)
    //   console.log("TestRESULT2"+io.sockets.adapter.rooms[room])
    //   console.log('Client ID ' + socket.id + ' created room ' + room);
    //   socket.emit('created', room, socket.id);
    // }else if(numClients===1) {
    //   console.log('Client ID ' + socket.id + ' joined room ' + room);
    //   io.sockets.in(room).emit('join', room);
    //   socket.join(room);
    //   socket.emit('joined', room, socket.id);
    //   io.sockets.in(room).emit('ready');
    // }else { // max two clients
    //   socket.emit('full',room)
    // }
  })
  socket.on('ipaddr', function() {
    var ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
      ifaces[dev].forEach(function(details) {
        if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
          socket.emit('ipaddr', details.address);
        }
      });
    }
  });
})








httpServer.listen(4000, () => {
  console.log('HTTPS Server is running at 4000!');
});