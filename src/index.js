console.log("Application started");
const getActualTemperature = require('./getActualTemperature');
const smoothValues = require('./smoothValues');
const fanController = require('./fanController');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

//Constants
const tempVariance = 5;

//State
let targetTemperature = 225;
let actualTemperature = 0;
let autoControlFan = false;

const gatherData = function () {
    return {
        currentTemp: actualTemperature,
        targetTemp: targetTemperature,
        autoControlFan: autoControlFan
    };
};

const propagateData = function () {
    io.sockets.emit('dataupdate', gatherData());
};


const updateActualTemperature = function () {
    actualTemperature = smoothValues(getActualTemperature());
    propagateData();
    setTimeout(updateActualTemperature, 500);
};

const operateFan = function(){
  //Guard Clause
  if(!autoControlFan)
    return;
  console.log("Actual Temp:"+actualTemperature+", tempVariance:"+tempVariance+",targetTemperature:"+targetTemperature);
  //I'm using an acceptable temp variance because I don't want to burn out the relay with constant on off switching
  if((actualTemperature + tempVariance) > targetTemperature)
    fanController(0);//Turn off fan
  else if((actualTemperature - tempVariance) < targetTemperature)
    fanController(1);//Turn on fan

  setTimeout(operateFan, 500);
};

//Express setup
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/../public'));
 app.get('/', function(req, res){
   res.render('index', gatherData());
 });


//Socket.IO
io.on('connection', function(socket){
  socket.on('increment', function(){
    targetTemperature += 1;
    propagateData();
  });
  socket.on('decrement', function(){
    targetTemperature -= 1;
    propagateData();
  });
  socket.on('fan-on', function(){
    console.log("Fan On Triggered");
    autoControlFan = true;
    propagateData();
  });
  socket.on('fan-off', function(){
    console.log("Fan Off Triggered");
    autoControlFan = false;
    propagateData();
  });
});

//Continuous execution
http.listen(3000);
updateActualTemperature();
operateFan();
