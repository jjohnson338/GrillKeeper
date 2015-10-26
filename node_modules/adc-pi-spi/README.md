#     Read ADC (MCP3008) using spi

Read values from an MCP3008 connected to an raspberry pi using spidev

## Usage / Example


```coffeescript
ADC = require 'adc-pi-spi'
options =
	tolerance: 10		#default = 10
	pollInterval: 200	#default = 200
	channels: [0,1,2,3]	#default = [0]

adc=new ADC('/dev/spidev0.0', options)

adc.on 'change', (channel, value)->
	console.log 'channel ', channel, 'is now', value

process.on 'SIGTERM', () ->
	adc.close()

process.on 'SIGINT', () ->
	adc.close()

process.on 'exit', () ->
	adc.close()
```

## API

  - [ADC(device:String,[options:Array])](#adcdevicestringoptionsarray)
  - [ADC.state([channel:Number])](#adcstatechannelnumber)
  - [ADC.close()](#adcclose)
  - [ADC.read(channel, callbackfunction))](#adcreadchannelnumber-callback-function)

## ADC(device:String,[options:Array])

  Setting up a new ADC. Options are optional. The device name is the full path to the spi device, like /dev/spidev0.0
  
```coffeescript
options =
	tolerance: 10		#default = 10
	pollInterval: 200	#default = 200
	channels: [0,1,2,3]	#default = [0]

adc=new ADC('/dev/spidev0.0', options)
```



## ADC.state([channel:Number])

Retrieve the current state of the inputs. 
If no channel is given, the function will return the values of all defined channels (see options). 
If a channel is given, the function will return only the value of the choosen channel.

The values are absolute values from the adc (e.g. 0..1023 if you are using a 10Bit chip)

## ADC.close()

  Close the spi device

## ADC.read(channel:Number, callback: function())

Read the current value of the channel. Note: state() uses the buffered state which is updated automatically each pollInterval (see options). Read always reads the actual data without updating the state().

## Options

- tolerance

    Change-Event will not fire if the difference between the current and the last value is lower than the tolerance

- pollInterval

	The ADC is polled every pollInterval milliseconds.

- channels

	The ADC channels to monitor, state() and events only contains theese channels

## Events

- change

	Fires if a channel value changes more than the tolerance value. The events has two parameters:
    
	* channel: Number the number of the channel which changed
	* value: Number the absolute value of the channel

    ### Example
```coffeescript
adc.on 'change', (channel, value)->
console.log 'channel ', channel, 'is now', value
```