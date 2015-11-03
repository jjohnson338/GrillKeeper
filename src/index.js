//Test
var temperatureController = require('./temperatureController');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/../public'));
 app.get('/', function(req, res){
   res.render('index', {currentTemp: temperatureController.GetActualTemperature(),
                        targetTemp: temperatureController.GetTargetTemperature()});
 });


//Socket.IO
io.on('connection', function(socket){
  socket.on('increment', function(){
    temperatureController.IncrementTargetTemperature();
    propagateData();
  });
  socket.on('decrement', function(){
    temperatureController.DecrementTargetTemperature();
    propagateData();
  })
});

function propagateData(){
  io.sockets.emit('dataupdate', {currentTemp: temperatureController.GetActualTemperature(),
                                  targetTemp: temperatureController.GetTargetTemperature()});
}

http.listen(3000);
