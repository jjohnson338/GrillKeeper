const Gpio = require('onoff').Gpio;
const fan = new Gpio(4, 'out');

const fanController = function(state){
  fan.writeSync(state);
};

module.exports = fanController;
