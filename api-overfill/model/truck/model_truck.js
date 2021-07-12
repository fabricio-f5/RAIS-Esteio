const msgs = require('../../commons/allMessages')
const knex = require('../../database/connection')
const db_errors = require('../../commons/db_errors')
const errorsMsgs = require('../../commons/errorsMsgs')
const operational_log = require('../../commons/operational_log')
const applyRules = require('./bs_truck')
const jsonResponse = require('../../commons/DialogReactAndApi')


exports.addTruck = (truck,callback) => {
let result = jsonResponse()
    try {
                applyRules(knex,result,truck,'add')
                .then(() => {

                  truck.compartSecondTrain = !truck.compartSecondTrain ? 0 :  parseInt(truck.compartSecondTrain)
                  truck.compartFirstTrain = !truck.compartFirstTrain ? 0 :  parseInt(truck.compartFirstTrain)
                  truck.at = truck.at.toUpperCase()  
                    
                  truck.totalCompart = truck.compartFirstTrain + truck.compartSecondTrain
                  
                    knex('truck').insert(truck)
                        .then(() => {
                            result.msg = msgs.ad_msg
                            result.status=201
                            operational_log.log('addTruck',result,truck)
                        })    
                        .catch((err) => {
                            result.errStack = err
                            result.msg = db_errors.errorHandling(err)
                            result.status=422
                        })
                        .finally(() => { 
                            operational_log.log('addTruck',result,truck)
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

exports.updateTruck = (truck,callback) => {
    let result = jsonResponse()
    try { 
        applyRules(knex,result,truck,'update')
        .then(() => {

            truck.compartSecondTrain = !truck.compartSecondTrain ? 0 :  parseInt(truck.compartSecondTrain)
            truck.compartFirstTrain = !truck.compartFirstTrain ? 0 :  parseInt(truck.compartFirstTrain)
            truck.at = truck.at.toUpperCase()  
              
            truck.totalCompart = truck.compartFirstTrain + truck.compartSecondTrain

            knex('truck').update(truck).where('id',truck.id)
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
                    operational_log.log('updateTruck',result,truck)
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

exports.deleteTruck = (id,callback) => {
    let result = jsonResponse()
    try {
        knex('truck').where('id',id)
            .then((element) => { 
                if (element.length > 0) {
                    knex('truck').where('id',id).delete()
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
                        operational_log.log('deleteTruck',result,id)
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

exports.editTruck = (id,callback) => {
    let result = jsonResponse()    
    try { 
        knex('truck').where('id',id)
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
                operational_log.log('editTruck',result,id)
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

exports.getTruck = (truck,callback) => {
    let result = jsonResponse()    
    try { 
        knex('truck').where('at',truck)
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
                operational_log.log('getTruck',result)
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

exports.allTruck = (callback) => {
    let result = jsonResponse()
    try {
        knex('truck').select('*').orderBy('at')
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
                operational_log.log('allTruck',result)
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

exports.reportTruck = (filter,callback) => {
    let result = jsonResponse()
    try { 
        let whereClause=''
        if (filter.value != '') { 
            whereClause = "where " + filter.field + " like '%" + filter.value + "%'"
        }
                
        knex.raw('Select * from truck ' + whereClause)
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
                operational_log.log('reportTruck',result)
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









         



