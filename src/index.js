const temperatureController = require('./temperatureController');
const express = require('express');
const http = require('http').Server(express);
const io = require('socket.io')(http);

const gatherData = function (){
    return {
        currentTemp: temperatureController.getActualTemperature(),
        targetTemp: temperatureController.getTargetTemperature(),
    };
};

const propagateData = function () {
    var results = gatherData();
    io.sockets.emit('dataupdate', results);
};

const app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/../public'));
 app.get('/', function(req, res){
   res.render('index', gatherData());
 });

 app.listen(3000);


 //Socket.IO
 io.on('connection', function(socket) {
     socket.on('increment', function(){
         temperatureController.incrementTargetTemperature();
         propagateData();
     });
     socket.on('decrement', function() {
         temperatureController.decrementTargetTemperature();
         propagateData();
     })
 });
