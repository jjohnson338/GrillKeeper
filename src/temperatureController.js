var Gpio = require('onoff').Gpio,
  blueled = new Gpio(17, 'out');

var temperatureControlerObject = function() {
  var targetTemperature = 225;
  var actualTempurature = 0;

  var getTargetTemperature = function(){
    return targetTemperature;
  }

  var setTargetTemperature = function(newTargetTemp){
    targetTemperature = newTargetTemp;
    //Send command to pi
    blueled.writeSync(1);
    setTimeout(function(){
      blueled.writeSync(0);
    }, 500);
  }
  var incrementTargetTemperature = function() {
    setTargetTemperature(++targetTemperature);
  }
  var decrementTargetTemperature = function() {
    setTargetTemperature(--targetTemperature);
  }

  var getActualTemperature = function(){
    //Run code to determine actual temperature
    return actualTempurature;
  }

  return {
    //Pubic functions
    getTargetTemperature: getTargetTemperature,
    setTargetTemperature: setTargetTemperature,
    incrementTargetTemperature: incrementTargetTemperature,
    decrementTargetTemperature: decrementTargetTemperature,
    getActualTemperature: getActualTemperature
  }
}();

module.exports = temperatureControlerObject;
