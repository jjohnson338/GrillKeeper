//Socket.io
var socket = io.connect(window.location.href);


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
  document.getElementById('currentTempValue').innerHTML = data.currentTemp;
  document.getElementById('targetTempValue').innerHTML = data.targetTemp;
});
