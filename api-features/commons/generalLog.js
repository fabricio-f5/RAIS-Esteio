const {createLogger,format,transports} = require('winston');

require('dotenv').config()

const logger = createLogger({
    format: format.combine(
        format.simple(),
        format.timestamp(),
        format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    transports: [
        new transports.File({
            maxsize: 100000,
            maxFiles: 1,
            filename: process.env.LOG
        }),
        new transports.Console({
            level: 'debug'
        })
        
    ]
});

module.exports = logger





