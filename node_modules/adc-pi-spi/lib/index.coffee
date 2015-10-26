SPI = require 'spi'
EventEmitter = require('events').EventEmitter


class ADC extends EventEmitter
	constructor: (device, options) ->
		@pollInterval = 200
		@tolerance = 10
		@channels = [0]
		@device = '/dev/spidev0.0'
		@device = device if device?
		
		if options?
			@pollInterval = options.pollInterval if options.pollInterval?
			@tolerance = options.tolerance if options.tolerance?
			@channels = options.channels if options.channels?

		@_state = new Array()

		@_spi = new SPI.Spi @device, [], (s)->
			s.open()

		@_poll = setInterval () =>
			for c in @channels
				@read c, (value)=>
					if Math.abs(@_state[c]-value)>@tolerance
						@_state[c]=value
						@emit 'change', c, value


		,@pollInterval

		for c in @channels
			@_state[c]=0

	close: () ->
		@_spi.close();
		clearInterval(@_poll)

	read: (channel, cb) ->
		txBuf=new Buffer([1, 8 + channel << 4, 0])
		rxBuf=new Buffer([0,0,0])

		@_spi.transfer txBuf, rxBuf, (device, buf) ->
			ret=((buf[1] & 3) << 8) + buf[2]
			cb(ret)

	state: (channel) ->
		return @_state if not channel?
		return @_state[channel]

module.exports = ADC
