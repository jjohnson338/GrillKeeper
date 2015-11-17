//Socket.io
const socket = io.connect(window.location.href);

const checkboxChanged = function(cb){
  if(cb.checked == true){
    socket.emit('fan-on');
  }
  else{
    socket.emit('fan-off');
  }
};

window.onload = function(){
  //Register events
  document.getElementById('upButton').onclick = function(){
    socket.emit('increment');
  };
  document.getElementById('downButton').onclick = function(){
    socket.emit('decrement');
  };
}

socket.on('dataupdate', function(data){
  document.getElementById('currentTempValue').innerHTML = 'Current Temp  : ' + data.currentTemp +'&deg;F';
  document.getElementById('targetTempValue').innerHTML = 'Target Temp  : ' + data.targetTemp +'&deg;F';
  document.getElementById('fanCheckBox').checked = data.fanState;
});
