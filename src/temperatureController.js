var temperatureControlerObject = function() {

  var adcinterface = require('./adcinterface');

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
    adcinterface.readChannel(0, function(thermValue){
      adcinterface.readChannel(1, function(controlValue){
        console.log('ThermValue =' + thermValue);
        console.log('ControlValue =' + controlValue);
        var controlVoltage = (controlValue*5)/1023;
        var thermVoltage = (thermValue*5)/1023;
        return controlVoltage - thermVoltage;
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
