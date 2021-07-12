const msgs = require('../../commons/allMessages')
const knex = require('../../database/connection')
const db_errors = require('../../commons/db_errors')
const errorsMsgs = require('../../commons/errorsMsgs')
const operational_log = require('../../commons/operational_log')
const applyRules = require('./bs_driverSms')
const jsonResponse = require('../../commons/DialogReactAndApi')


exports.addDriverSms = (driverSms,callback) => {
let result = jsonResponse()
    try {
                applyRules(knex,result,driverSms,'add')
                .then(() => {
                    knex('driver').insert(driverSms)
                        .then(() => {
                            result.msg = msgs.ad_msg
                            result.status=201
                            operational_log.log('addDriverSms',result,driverSms)
                        })    
                        .catch((err) => {
                            result.errStack = err
                            result.msg = db_errors.errorHandling(err)
                            result.status=422
                        })
                        .finally(() => { 
                            operational_log.log('addDriverSms',result,driverSms)
                            if (typeof callback == 'function') callback(result)
                        })
                })
                .catch((result) => {
                    result.status=200
                    result.bsApproved=false
                    if (typeof callback == 'function') callback(result)
                })
    }
    catch(err) {
        result.status=422
        result.errStack = err
        errorsMsgs.errorHandling(err.message)
        if (typeof callback == 'function') callback(result)
    }
}

exports.updateDriverSms = (driverSms,callback) => {
    let result = jsonResponse()
    try { 
        applyRules(knex,result,driverSms,'update')
        .then(() => {
            knex('driver').update(driverSms).where('id',driverSms.id)
                .then((wasUpdated) => {
                    if (wasUpdated >0) { 
                    result.msg = msgs.up_msg 
                        result.status=200
                    } else { 
                        result.msg = msgs.not_up_msg
                        result.status=422    
                    }
                })
                .catch((err) => {
                    result.errStack = err
                    result.msg = db_errors.errorHandling(err)
                    result.status=422
                })
                .finally(() => { 
                    operational_log.log('updateDriverSms',result,driverSms)
                    if (typeof callback == 'function') callback(result)
                })
            })
        .catch((result) => {
            result.status=200
            result.bsApproved = false 
            if (typeof callback == 'function') callback(result)
        })
        }
    catch(err) {
        result.status=422
        result.errStack = err
        errorsMsgs.errorHandling(err.message)
        if (typeof callback == 'function') callback(result)
    }
}

exports.deleteDriverSms = (id,callback) => {
    let result = jsonResponse()
    try {
        knex('driver').where('id',id)
            .then((element) => { 
                if (element.length > 0) {
                    knex('driver').where('id',id).delete()
                    .then(() => {
                        result.msg = msgs.de_msg 
                        result.status=200
                    })    
                    .catch((err) => {
                        result.errStack = err
                        result.msg = db_errors.errorHandling(err)
                        result.status=422
                    })
                    .finally(() => { 
                        operational_log.log('deleteDriverSms',result,id)
                        if (typeof callback == 'function') callback(result)
                    })
                }else {
                    result.msg = msgs.registerNotFound
                    result.status=404
                    if (typeof callback == 'function') callback(result)
                }
            })
            .catch(() => {
                result.status=404
                result.msg = msgs.registerNotFound
                if (typeof callback == 'function') callback(result)
            })
            
    }
    catch(err) {
        result.status=422
        result.errStack = err
        errorsMsgs.errorHandling(err.message)
        if (typeof callback == 'function') callback(result)
    }
}

exports.editDriverSms = (id,callback) => {
    let result = jsonResponse()    
    try { 
        knex('driver').where('id',id)
            .then((element) => { 
                if (element.length > 0) {
                    result.msg = msgs.ed_msg 
                    result.registers = element
                    result.status=200
                }else {
                    result.msg = msgs.registerNotFound
                    result.status=404
                }
            })
            .catch((err) => {
                result.status=422
                result.errStack = err
                result.msg = db_errors.errorHandling(err)
            })
            .finally(() => { 
                operational_log.log('editDriverSms',result,id)
                if (typeof callback == 'function') callback(result)
            })
    }
    catch(err) {
        result.status=422
        result.errStack = err
        errorsMsgs.errorHandling(err.message)
        if (typeof callback == 'function') callback(result)
    }
}

exports.getDriverSms = (driverSms,callback) => {
    let result = jsonResponse()    
    try { 
        knex('driver').where('code',driverSms)
            .then((element) => { 
                if (element.length > 0) {
                    result.msg = msgs.ed_msg 
                    result.registers = element
                    result.status=200
                }else {
                    result.msg = msgs.registerNotFound
                    result.status=404
                }
            })
            .catch((err) => {
                result.status=422
                result.errStack = err
                result.msg = db_errors.errorHandling(err)
            })
            .finally(() => { 
                operational_log.log('getDriverSms',result)
                if (typeof callback == 'function') callback(result)
            })
    }
    catch(err) {
        result.status=422
        result.errStack = err
        errorsMsgs.errorHandling(err.message)
        if (typeof callback == 'function') callback(result)
    }
}

exports.allDriverSms = (callback) => {
    let result = jsonResponse()
    try {
        knex('driver').select('*').orderBy('code')
            .then( (registers) => {
                if (registers.length > 0) {
                    result.msg = registers.length + msgs.al_msg
                    result.registers = registers
                    result.status=200
                }
                else {
                    result.msg = msgs.registerNotFound
                    result.status=200
                }
            })
            .catch((err) => {
                result.status=422
                result.errStack = err
                result.msg = db_errors.errorHandling(err)
            })
            .finally(() => { 
                operational_log.log('allDriverSms',result)
                if (typeof callback == 'function') callback(result)
            })
    }
    catch(err) {
        result.status=422
        result.errStack = err
        errorsMsgs.errorHandling(err.message)
        if (typeof callback == 'function') callback(result)
    }
}

exports.reportDriverSms = (filter,callback) => {
    let result = jsonResponse()
    try { 
        let whereClause=''
        if (filter.value != '') { 
            whereClause = "where " + filter.field + " like '%" + filter.value + "%'"
        }
                
        knex.raw('Select * from driver ' + whereClause)
            .then( (registers) => {
                if (registers[0].length > 0) {
                    result.msg = registers[0].length + msgs.al_msg
                    result.registers = registers
                    result.status=200
                }
                else {
                    result.msg = msgs.registerNotFound
                    result.status=404 
                }
            })
            .catch((err) => {
                result.status=422
                result.errStack = err
                result.msg = db_errors.errorHandling(err)
            })
            .finally(() => { 
                operational_log.log('reportDriverSms',result)
                if (typeof callback == 'function') callback(result)
            })
    }
    catch(err) {
        result.status=422
        result.errStack = err
        errorsMsgs.errorHandling(err.message)
        if (typeof callback == 'function') callback(result)
    }
   
}









         



