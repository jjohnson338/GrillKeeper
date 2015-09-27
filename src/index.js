var temperatureController = require('./temperatureController');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/../public'));
 app.get('/', function(req, res){
   res.render('index', {currentTemp: temperatureController.getActualTemperature(),
                        targetTemp: temperatureController.getTargetTemperature()});
 });


//Socket.IO
io.on('connection', function(socket){
  socket.on('increment', function(){
    temperatureController.incrementTargetTemperature();
    io.sockets.emit('dataupdate', {currentTemp: temperatureController.getActualTemperature(),
                                    targetTemp: temperatureController.getTargetTemperature()});
  });
  socket.on('decrement', function(){
    temperatureController.decrementTargetTemperature();
    io.sockets.emit('dataupdate', {currentTemp: temperatureController.getActualTemperature(),
                                    targetTemp: temperatureController.getTargetTemperature()});
  })
});

http.listen(3000);
