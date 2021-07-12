const envVar = require('../config/envConfig')
const {createLogger,format,transports} = require('winston')

const logger = createLogger({
    format: format.combine(
        format.simple(),
        format.timestamp(),
        format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    transports: [
        new transports.File({
            maxsize: 10000,
            maxFiles: 1,
            filename: envVar.envLog
        }),
        new transports.Console({
            level: 'debug'
        })
        
    ]
});

module.exports = logger





