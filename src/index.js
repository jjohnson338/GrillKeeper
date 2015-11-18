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


const updateTempAndRegulateFan = function () {
    actualTemperature = smoothValues(getActualTemperature());
    operateFan();
    propagateData();
    setTimeout(updateTempAndRegulateFan, 500);
};

const operateFan = function(){
  //Guard Clauses
  if(!autoControlFan){
    fanController(0);//Turn off fan
    return;
  }
  if((actualTempurature < (targetTemperature + tempVariance)) && (actualTempurature > (targetTemperature - tempVariance)))
    return; //We're within the acceptable variance range...do nothing

  //If we're outside of the acceptable temp variance range, do something
  if(actualTempurature > targetTemperature)
    fanController(0);//Turn off fan
  else if(actualTempurature < targetTemperature)
    fanController(1);
    
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
updateTempAndRegulateFan();
