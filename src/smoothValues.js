const last20TempsArr = [];

const smoothValues = function(newvalue){
  last20TempsArr.unshift(newvalue);//Add new value to front of array

  //Lets keep it to twenty
  if(last20TempsArr.length <= 20)
    last20TempsArr.pop();

  let accumulator = 0;
  for (let temp of last20TempsArr) {
    accumulator += temp;
  }
  let smoothedValue = accumulator / last20TempsArr.length;
  smoothedValue = Math.round(smoothedValue);
  return smoothedValue;
};

module.exports = smoothValues;
