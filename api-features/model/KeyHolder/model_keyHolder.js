const msgs = require('../../commons/allMessages')
const knex = require('../../database/connection')
const db_errors = require('../../commons/db_errors')
const errorsMsgs = require('../../commons/errorsMsgs')
const operational_log = require('../../commons/operational_log')
const applyRules = require('./bs_keyHolder')
const jsonResponse = require('../../commons/DialogReactAndApi')


exports.addKeyHolder = (keyHolder,callback) => {
let result = jsonResponse()
    try {
                applyRules(knex,result,keyHolder,'add')
                .then(() => {
                    knex('keyholder').insert(keyHolder)
                        .then((id) => {
                            result.msg = msgs.ad_msg
                            result.status=201
                            result.registers = {keyHolder_id:id[0]}
                            operational_log.log('addKeyHolder',result,keyHolder)
                        })    
                        .catch((err) => {
                            result.errStack = err
                            result.msg = db_errors.errorHandling(err)
                            result.status=422
                        })
                        .finally(() => { 
                            operational_log.log('addKeyHolder',result,keyHolder)
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

exports.updateKeyHolder = (keyHolder,callback) => {
    let result = jsonResponse()
    try { 
        applyRules(knex,result,keyHolder,'update')
        .then(() => {
            knex('keyholder').update(keyHolder).where('id',keyHolder.id)
                .then((wasUpdated) => {
                    if (wasUpdated >0) { 
                      result.msg = msgs.up_msg 
                        result.status=200
                        result.registers = {keyHolder_id:keyHolder.id}
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
                    operational_log.log('updatekeyHolder',result,keyHolder)
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

exports.deleteKeyHolder = (id,callback) => {
    let result = jsonResponse()
    try {
        knex('keyholder').where('id',id)
            .then((element) => { 
                if (element.length > 0) {
                    knex('keyholder').where('id',id).delete()
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
                        operational_log.log('deleteKeyHolder',result,id)
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

exports.editKeyHolder = (id,callback) => {
    let result = jsonResponse()    
    try { 
        knex('keyholder').where('id',id)
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
                operational_log.log('editKeyHolder',result,id)
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

exports.getKeyHolderByNumber = (keyHolderNumber,callback) => {
    let result = jsonResponse()    
    try { 
        knex('keyholder').where('number',keyHolderNumber)
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
                operational_log.log('getKeyHolderByNumber',result,keyHolderNumber)
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

exports.allKeyHolder = (callback) => {
    let result = jsonResponse()
    try {
        knex('keyholder').select('id','number','identification','qtdeKeys').orderBy('number','asc')
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
                operational_log.log('allKeyHolder',result)
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

exports.reportKeyHolder = (filter,callback) => {
    let result = jsonResponse()
    try { 
        let whereClause=''
        if (filter.value != '') { 
            whereClause = "where " + filter.field + " like '%" + filter.value + "%'"
        }
                
        knex.raw('Select * from keyholder ' + whereClause)
            .then( (registers) => {
                if (registers[0].length > 0) {
                    result.msg = registers[0].length + msgs.al_msg
                    result.registers = registers[0]
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
                operational_log.log('reportKeyHolder',result)
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









         



