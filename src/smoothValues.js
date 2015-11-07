const last20TempsArr = [];

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

module.exports = smoothValues;
