//Socket.io
const socket = io.connect(window.location.href);


window.onload = function(){
  //Register events
  document.getElementById('upButton').onclick = function(){
    socket.emit('increment');
  };
  document.getElementById('downButton').onclick = function(){
    socket.emit('decrement');
  };
  document.getElementById('fanButton').onclick = function(){
    if(this.innerHTML == "Enable Automatic Fan Control")
      socket.emit('fan-on');
    else if (this.innerHTML == "Disable Automatic Fan Control")
      socket.emit('fan-off');
  };
}

socket.on('dataupdate', function(data){
  document.getElementById('currentTempValue').innerHTML = 'Current Temp  : ' + data.currentTemp +'&deg;F';
  document.getElementById('targetTempValue').innerHTML = 'Target Temp  : ' + data.targetTemp +'&deg;F';
  document.getElementById('fanButton').innerHTML = data.autoControlFan ? "Disable Automatic Fan Control" : "Enable Automatic Fan Control";
});
