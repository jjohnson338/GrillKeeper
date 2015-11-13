const readChannel = require("./readChannel");
const math = require("mathjs");

const ExcitationVoltage = 5.0;

//Since i'm not exposing this function, it's essentially private
const diffVoltageToTemp = function(DiffVoltage){
    //Constants
    const R = 47000; //Resistance of Known Resistors

    //Steinhart-Hart Coefficients
    const A = 0.000515942869144762;
    const B = 0.000172084582161862;
    const C = 2.38992092042526e-7;

    //Calculate Resistance of Thermistor
    const ThermistorResistance = (-2*R)*(((DiffVoltage/ExcitationVoltage)+0.5)/((2*(DiffVoltage/ExcitationVoltage))-1));

    //Calculate Temp in Kelvin using the Steinhart-Hart Equation
    const TempKelvin = 1/(A+(B*(math.log(ThermistorResistance)))+(C*math.pow(math.log(ThermistorResistance), 3)));

    //Convert Kelvin to Fahrenheit and return it
    return math.round(((TempKelvin - 273.15)*1.8)+32);
};

const getActualTemperature = function () {
    //Run code to determine actual temperature
    const thermValue = readChannel(0);
    const controlValue = readChannel(1);
    console.log("thermValue: "+ thermValue);
    console.log("controlValue" + controlValue);

    const controlVoltage = (controlValue * ExcitationVoltage)/1023;
    const thermVoltage = (thermValue * ExcitationVoltage)/1023;
    const voltageDiff = thermVoltage - controlVoltage;
    const actualTempurature = diffVoltageToTemp(voltageDiff);

    return actualTempurature;
};

module.exports = getActualTemperature;
