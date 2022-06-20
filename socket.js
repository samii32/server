var app = require('express')();
var server = require('http').createServer(app);

var io = require('socket.io')(server, {
    allowEIO3: true,
     cors: {
         origin:['http://localhost:8080','http://localhost:8081','http://localhost:8082'],
         methods: ["GET", "POST"],
         credentials: true,
         allowedHeaders: ["my-custom-header"]
   }
});

// let corsOption = {
//     origin: 'http://localhost:8080',    // 허용 주소
//     credentials: true                   // true시 설정 내용을 응답헤더에 추가해 줌
// }
//setting cors 
// app.use(cors({
//     origin: '*', // 출처 허용 옵션 
//     credential: 'true' // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근 
// }));
// app.all('/*', function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     next();
// });

app.get('/', function (req, res) {
    console.log('hello')
    res.sendFile('Hellow Chating App Server');
});
app.get('/socket.io', function (req, res) {
    console.log('hello')
    res.sendFile('Hellow Chating App Server');
});
//connection event handler 
io.on('connection', function (socket) {
    console.log('Connect from Client: ' + socket)
    console.log("SOCKETIO connection EVENT: ", socket.id, " client connected");
    
    socket.on('joinRoom', function(msg) {     // joinRoom을 클라이언트가 emit 했을 시
        let roomName = msg;
        console.log('roomName:'+roomName);
        socket.join(roomName);    // 클라이언트를 msg에 적힌 room으로 참여 시킴
        console.log('join....')
    });
    
    socket.on('chat', function (data) {
        console.log('message from Client: name:' +data.name+',msg:'+ data.msg+',to:'+data.to+'에게....방채널:'+data.channelNo)

        socket.to(data.channelNo).emit('broadcast', {
            name: data.name,
            msg: data.msg,
            to: data.to
        });
        //채널상관없이 전체로 말하기
        // socket.broadcast.emit('broadcast', {
        //     name: data.name,
        //     msg: data.msg,
        //     to: data.to
        // });
    });
    
})

server.listen(3001, function () {
    console.log('socket io server listening on port 3001')
})
