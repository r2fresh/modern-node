var fs = require('fs');

//var server = require('http').createServer();
//var io = require('socket.io').listen(server);

var http = require('http');
var socketio = require('socket.io');

// server.listen(52273, function(){
//     console.log('Server Running at http://127.0.0.1:52273');
// })

// server.on('request',function(request,response){
//     fs.readFile('HTMLPage.html', 'utf8', function(error, data){
//         response.writeHead(200,{
//             'Content-Type':'text/html;charset=utf-8'
//         })
//         response.end(data)
//     })
// })

var server = http.createServer(function(request, response){
        fs.readFile('HTMLPage.html', function(error, data){
            response.writeHead(200,{
                'Content-Type':'text/html;'
            })
            response.end(data)
        })
}).listen(52273, function(){
    console.log('Server Running at http://127.0.0.1:52273');
})

var io = socketio.listen(server);

// io.sockets.on('connection',function(socket){
//     socket.on('join', function(data){
//         socket.join(data);
//         socket.set('room', data)
//     })
//
//     socket.on('message', function(data){
//         socket.get('room',function(error, room){
//             io.sockets.in(room).emit('message', data)
//         })
//     })
// })

io.sockets.on('connection',function(socket){
    socket.on('join', function(data){
        socket.join(data);
        io.use(function(socket,next){
            socket.room = data;
            console.log('socket.room1 : ' + socket.room)
            next();
        })
    })

    socket.on('message', function(msg){
        console.log('socket.room : ' + socket.room)
        console.log('data : ' + msg)
        io.to(socket.room).emit('message', msg)
    })
})
