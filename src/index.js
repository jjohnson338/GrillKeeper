console.log("Application started");
const getActualTemperature = require('./getActualTemperature');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

//State
let targetTemperature = 225;
let actualTemperature = 0;
let last20TempsArr = [];

const gatherData = function () {
    return {
        currentTemp: actualTemperature,
        targetTemp: targetTemperature,
    };
};

const propagateData = function () {
    io.sockets.emit('dataupdate', gatherData());
};


const smoothValues = function(newvalue){
  last20TempsArr.unshift(newvalue);//Add new value to front of array

  //Lets keep it to twenty
  if(last20TempsArr.length <= 20)
    last20TempsArr.pop();

  let smoothedValue = 0;
  for (let temp of last20TempsArr) {
    smoothedValue += temp;
  }
  smoothedValue /= last20TempsArr.length;
  smoothedValue = Math.round(smoothedValue);
  return smoothedValue;
};

const updateActualTemperature = function () {
    actualTemperature = getActualTemperature();
    actualTemperature = smoothValues(actualTemperature);
    console.log(actualTemperature);
    propagateData();
    setTimeout(updateActualTemperature, 500);
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
  })
});


http.listen(3000);
updateActualTemperature();
