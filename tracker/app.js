var fs = require('fs');
var http = require('http');
var express = require('express');

var client = require('mysql').createConnection({
    user : 'root',
    password : 'r2fresh',
    database : 'location'
})

var app = express();
var server = http.createServer(app);

app.get('/tracker', function(request, response){
    fs.readFile('Tracker.html', function(error, data){
        response.send(data.toString());
    })
})

app.get('/observer', function(request, response){
    fs.readFile('Observer.html', function(error, data){
        response.send(data.toString())
    })
})

app.get('/showdata', function(request, response){
    client.query('SELECT * FROM locations WHERE name=?', [request.param('name')],function(error, data){
        response.send(data)
    })
})

server.listen(52273, function(){
    console.log('Server Running at http://127.0.0.1:52273');
})


var io = require('socket.io').listen(server);
io.sockets.on('connection', function(socket){
    socket.on('join', function(data){
        socket.join(data);
    })

    socket.on('location', function(data){
        client.query(
            'INSERT INTO locations(name,latitude, longitude, date) VALUES (?, ?, ?,NOW())',
            [data.name, data.latitude, data.longitude]);

        io.sockets.in(data.name).emit('receive', {
            latitude : data.latitude,
            longitude : data.longtitude,
            date : Date.now()
        })
    })
})
