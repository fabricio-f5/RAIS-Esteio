const logger = require('./generalLog')

exports.log = (url,result,obj) => {

    obj = obj != undefined ? JSON.stringify(obj) : ''
    if (result.errStack != '') { 
        logger.info('[' + url + ']-[DB-ERROR]: ' +  result.errStack +  '-' + (obj != '' ? ('[Item]:' + obj) : ''))  
    }else {
        logger.info('[' +  url + ']: ' +  result.msg  +  '-' + (obj != '' ? ('[Item]:' + obj) : ''))
    }
    return null
}