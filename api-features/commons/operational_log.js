const knex = require('../database/connection')
const logger = require('./generalLog')

exports.log = (url,result,obj) => {

    obj = obj != undefined ? JSON.stringify(obj) : ''
    if (result.errStack != '') { 
        logger.error(`${url}-[DB-ERROR]: ${result.errStack} - ${obj != `` ? (`[Item]: + ${obj}`) : ``}`)
    }else {
        logger.info(`[${url}]: ${result.msg} - ${obj != `` ? (`[Item]: + ${obj}`) : ``}`)
        knex.insert('operationallog').insert(obj)

    }
    return null
}