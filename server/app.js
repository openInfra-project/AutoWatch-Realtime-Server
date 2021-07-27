const app = require("express")();
//테스트용 https서버
//실제로 배포시 https로 배포해야한다.
const https = require('https')
const cors = require('cors')

//테스트용 http
const http = require('http')

const fs = require('fs');
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

// io.sockets.on('connection', function(socket) {

//   // convenience function to log server messages on the client
//   function log() {
//     var array = ['Message from server:'];
//     array.push.apply(array, arguments);
//     socket.emit('log', array);
//   }

//   socket.on('message', function(message) {
//     console.log('Client said: ', message);
//     // for a real app, would be room-only (not broadcast)
//     socket.broadcast.emit('message', message);
//   });

//   socket.on('create or join', function(room) {
//     console.log('Received request to create or join room ' + room);

//     var clientsInRoom = io.sockets.adapter.rooms[room];
//     // var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;
//     var numClients = io.engine.clientsCount;
//     console.log('Room ' + room + ' now has ' + numClients + ' client(s)');
    

//     if (numClients === 0) {
//       socket.join(room);
//       console. log('Client ID ' + socket.id + ' created room ' + room);
//       socket.emit('created', room, socket.id);

//     } else if (numClients === 1) {
//       console.log('Client ID ' + socket.id + ' joined room ' + room);
//       io.sockets.in(room).emit('join', room);
//       socket.join(room);
//       socket.emit('joined', room, socket.id);
//       io.sockets.in(room).emit('ready');
//     } else { // max two clients
//       socket.emit('full', room);
//     }
//   });

//   socket.on('ipaddr', function() {
//     var ifaces = os.networkInterfaces();
//     for (var dev in ifaces) {
//       ifaces[dev].forEach(function(details) {
//         if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
//           socket.emit('ipaddr', details.address);
//         }
//       });
//     }
//   });

//   socket.on('bye', function(){
//     console.log('received bye');
//   });

// });
// // io.sockets.on('connection', (socket) => {
//   socket.on('disconnect', () => {
//     console.log('disconnected');
//   });
// });
// var room_info = ""
// io.sockets.on('connection',(socket)=> {
//   //request랑 response 아직 구현 안해씀
//   socket.on('request',(room)=> {
//     socket.broadcast.emit("getRequest",room)
//     room_info =  room
//   })
//   socket.on('response',(room,isGrant)=> {
//     if(isGrant){
//       socket.broadcast.emit('getResponse',room.isGrant)
//       socket.emit('enter',room)
//     }
//   })
//   //-------------------------------------------
//   socket.on('connect',()=> {
//     socket.emit("onCollabo",socket.id)
//   })
//   socket.on('onCollabo',(id)=> {
//     socket.emit("collabo",room_info)
//   })
//   socket.on('collabo',(room)=> {
//     socket.emit('create or join',room)
//     console.log('Attempted to create or join room',room)
//   })
//   socket.on('message',(message)=> {
//     console.log("Client said: ",message)
//     socket.broadcast.emit('message',message)
//   })
//   var roominfo = [{
//     name:'',
//     count:0,
//   }]
  
//   socket.on('create or join' , (room)=> {
//     // console.log("Received request to create or join room " + room)
//     // var clientsInRoom = io.sockets.adapter.rooms[room]
//     // console.log("room name:"+room)
//     // console.log("TestRESULT"+io.sockets.adapter.rooms[room])
//     // console.log("TEST RESULT :"+io.sockets.adapter.rooms)
//     // var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length:0
//     // console.log('Room '+room+' now has' + numClients + ' clinet(s)')
//     roominfo.push({name:room})
//     socket.join(room)
//     socket.room = room
//     var index=0
//     for(i=0; i<roominfo.length; i++){
//       if(roominfo[i].name===room){
//         index = i
//         break;
//       }
//     }
//     console.log("client 수 :" + roominfo[index].count);
//     if(roominfo[index].count===0) {
//       roominfo[index].count++

//       console.log("client number:"+roominfo[index].count)
//       console.log('Client ID ' + socket.id + ' created room ' + room);
//       socket.emit('created',room,socket.id)
//     }else {
//       roominfo[index].count++
//       console.log("client number:"+roominfo[index].count)
//       console.log('Client ID ' + socket.id + ' joined room ' + room);
//       io.sockets.in(room).emit('join',room)
//       socket.emit('joined', room, socket.id);
//     }
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
//   })
//   socket.on('ipaddr', function() {
//     var ifaces = os.networkInterfaces();
//     for (var dev in ifaces) {
//       ifaces[dev].forEach(function(details) {
//         if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
//           socket.emit('ipaddr', details.address);
//         }
//       });
//     }
//   });
// })
let users = {}
let socketToRoom = {}
//방 입장인원 maximum 변수
const maximum = process.env.MAXIMUM ||4
//방이 시험모드인지 study모드인지 통신을 통해 들어옴
const rooomOption = ""
//study 모드의 경우 maximum을 4~8 명으로 정하고(유료화를 위해)
//test 모드의 경우 maximum은 찾아보기


io.sockets.on('connection',(socket)=> {
  console.log('it work?')
  socket.on('user_update',(data)=> {
    console.log("유저업데이트 체크!:"+JSON.stringify(data))
  })
  socket.on('join room',(data)=> {
    console.log('test')
    //여기서 socket.id 중복 검사 해야함
    
    //방에 인원이 1명이라도 있다면
    if(users[data.room]) {
      const length = users[data.room].length;
      //방 인원이 초과된다면 return
      if(length===maximum){
        socket.to(socket.id).emit('room_full');
        console.log("방이 꽉찼습니다.")
        return;
      }
      //방에 입장하기전에 중복체크
      if(users[data.room].filter(user=>user.id===socket.id).length>0){
        console.log("--------------Duplicate ID 입니다--------------")
        
      }else {
        //방에 입장
        users[data.room].push({id:socket.id,email:data.email})
      }
     

    }else { //방에 인원이 1명도 없으면 방을 생성해준다.
      users[data.room] = [{id:socket.id,email:data.email}]
    }
    socketToRoom[socket.id] = data.room
    socket.join(data.room)
    console.log(`[${socketToRoom[socket.id]}]: ${socket.id} enter`)
    console.log("사용자들 전부:"+JSON.stringify(users[data.room]))
    console.log("방 인원수 : "+users[data.room].length+"최대 인원수  :"+maximum)
    const count = io.engine.clientsCount;
    // may or may not be similar to the count of Socket instances in the main namespace, depending on your usage
    const count2 = io.of("/").sockets.size;
    console.log("소켓 클라이언트 카운트"+count+"테스트2:"+count2)
    //나 자신의 id 뺴고 나머지를 출력하는거니까 local에선 공백이 맞음
    const userInThisRoom = users[data.room].filter(user=>user.id!==socket.id)
    console.log("현재 들어온 사람을 뺸 나머지 사용자들:"+JSON.stringify(userInThisRoom))
    console.log("현재 들어온 사람 아이디 = socketid= "+socket.id)
    io.sockets.to(socket.id).emit('all_users', userInThisRoom)
  })
  socket.on('offer',data=> {
    let sdp = data.sdp
    let offerSendId = data.offerSendId
    let offerSendEmail = data.offerSendEmail
    socket.to(data.offerReciveID).emit('getOffer',{sdp,offerSendId,offerSendEmail,})
  })
  socket.on('answer',data=> {
    let sdp = data.sdp
    let answerSendID = data.answerSendID
    socket.to(data.answerREceiveID).emit('getAnswer',{sdp,answerSendID,})
  })
  socket.on('candidate',data=> {
    let candidate = data.candidate
    let candidateSendID =data.candidateSendID
    socket.to(data.candidateReceiveID).emit('getCandidate',{candidate,candidateSendID})
  })
  socket.on('disconnect', () => {
    //나간사람
    console.log(`[${socketToRoom[socket.id]}]: ${socket.id} exit`);
    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    if (room) {
      room = room.filter(user => user.id !== socket.id);
      users[roomID] = room;
      if (room.length === 0) {
          delete users[roomID];
          return;
      }
    }
    console.log(roomID)
    socket.to(roomID).emit('user_exit', {id: socket.id});
    console.log(users);
  })
})








httpServer.listen(4000, () => {
  console.log('HTTPS Server is running at 4000!');
});