var adcinterface = require('./adcinterface');

var temperatureControlerObject = function() {
  var targetTemperature = 225;
  var actualTempurature = 0;

  var getTargetTemperature = function(){
    return targetTemperature;
  }

  var setTargetTemperature = function(newTargetTemp){
    targetTemperature = newTargetTemp;
  }
  var incrementTargetTemperature = function() {
    setTargetTemperature(++targetTemperature);
  }
  var decrementTargetTemperature = function() {
    setTargetTemperature(--targetTemperature);
  }

  var getActualTemperature = function(){
    //Run code to determine actual temperature
    adcinterface.read(0, function(thermValue){
      adcinterface.read(1, function(controlValue){
        var voltageDiff = ((controlValue - thermValue)* 5.0) / 1023;
        return voltageDiff;
      });
    });
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
