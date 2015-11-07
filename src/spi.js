//Credit to github user shawndellysee for this work https://github.com/shawndellysse
const consoleLog = console.log;

// We override this because the spi lib has debugging statements left in
// thar are ran at require time
console.log = function () {};
const SPI = require("spi");
console.log = oldLog;

// We gotta patch the constructor due to it reporting errors via console.log
// instead of throwing. Callback here is useless because everything is done
// synchronously
const Spi = function (...args) {
    console.log = function (message) {
        throw new Error(message);
    };
    SPI.Spi.apply(this, args);
    console.log = consoleLog;
};

for (let key of Object.keys(SPI.Spi.prototype)) {
    Spi.prototype[key] = SPI.Spi.prototype[key];
}


// We gotta patch the open method due to it having debug statements left in
Spi.prototype.open = function (...args) {
    console.log = function () {};
    const retval = SPI.Spi.prototype.open.apply(this, args);
    console.log = consoleLog;
}

// Patch this one because the write function is synchronous and just does a
// current tick callback of the instance and the buffer.
Spi.prototype.write = function (buf) {
    let retval;
    SPI.Spi.prototype.write.call(this, buf, (instance, buf) => {
        retval = buf;
    });
    return retval;
};

Spi.prototype.read = function (buf) {
    let retval;
    SPI.Spi.prototype.read.call(this, buf, (instance, buf) => {
        retval = buf;
    });
    return retval;
};

Spi.prototype.transfer = function (tx) {
    let retval;
    const rx = new Buffer(tx.length);
    SPI.Spi.prototype.transfer.call(this, tx, rx, (instance, rxbuf) => {
        retval = rxbuf;
    });
    return retval;
};


// We gotta patch this method because it reports errors via console log
Spi.prototype.mode = function (args) {
    console.log = function (message) {
        throw new Error(message);
    };

    const retval = SPI.Spi.prototype.mode.apply(this, args);

    console.log = consoleLog;
    return retval;
};

// We gotta patch this method because it reports errors via console log
Spi.prototype.chipSelect = function (...args) {
    console.log = function (message) {
        throw new Error(message);
    };

    const retval = SPI.Spi.prototype.chipSelect.apply(this, args);

    console.log = consoleLog;
    return retval;
};

// We gotta patch this method because it reports errors via console log
Spi.prototype.bitOrder = function (...args) {
    console.log = function (message) {
        throw new Error(message);
    };

    const retval = SPI.Spi.prototype.bitOrder.apply(this, args);

    console.log = consoleLog;
    return retval;
};

// We gotta patch this method because it reports errors via console log
Spi.prototype.maxSpeed = function (...args) {
    console.log = function (message) {
        throw new Error(message);
    };

    const retval = SPI.Spi.prototype.maxSpeed.apply(this, args);

    console.log = consoleLog;
    return retval;
};

// We gotta patch this method because it reports errors via console log
Spi.prototype.bitsPerWord = function (...args) {
    console.log = function (message) {
        throw new Error(message);
    };

    const retval = SPI.Spi.prototype.bitsPerWord.apply(this, args);

    console.log = consoleLog;
    return retval;
};

module.exports = Object.assign({}, SPI, {
    Spi: Spi,
});
