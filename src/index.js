const temperatureController = require('./temperatureController');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const gatherData = function () {
    return {
        currentTemp: temperatureController.getActualTemperature(),
        targetTemp: temperatureController.getTargetTemperature(),
    };
};

const propagateData = function () {
    io.sockets.emit('dataupdate', gatherData());
};

app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/../public'));
 app.get('/', function(req, res){
   res.render('index', gatherData());
 });


//Socket.IO
io.on('connection', function(socket){
  socket.on('increment', function(){
    temperatureController.incrementTargetTemperature();
    propagateData();
  });
  socket.on('decrement', function(){
    temperatureController.decrementTargetTemperature();
    propagateData();
  })
});


http.listen(3000);
