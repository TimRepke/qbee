'use strict';

var log4js = require('log4js');

log4js.configure({
    appenders: [{
        type: 'console',
        layout: {
            type: 'pattern',
            pattern: '[%d{ISO8601}] [%p] %m'
        }
    }],
    replaceConsole: true
});

var logger = log4js.getLogger();
logger.log = logger.info;
logger.json = function(obj, prefix) {
    prefix = !!prefix ? prefix + ': ' : '';
    try {
        logger.trace(prefix + JSON.stringify(obj, null, 2));
    } catch (e) {
        logger.trace('failed to stringify: ' + prefix + obj);
    }
};

var logLevel = process.env.LOG || 'INFO';
console.log('Log Level: ' + logLevel);
logger.setLevel(logLevel);


module.exports = logger;