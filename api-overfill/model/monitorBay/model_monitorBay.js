const msgs = require('../../commons/allMessages')
const knex = require('../../database/connection')
const db_errors = require('../../commons/db_errors')
const errorsMsgs = require('../../commons/errorsMsgs')
const operational_log = require('../../commons/operational_log')
const applyRules = require('./bs_monitorBay')
const jsonResponse = require('../../commons/DialogReactAndApi')

const addHistoricalRegister = (monitorBay) => {

    return new Promise((resolve,reject)=> {
        knex('monitorBay').leftJoin('truck','truck.id','=','monitorBay.truck_id')
                .select('bayNumber','bayName','bayType','at','tripNumber',
                        'capacity','b_train','totalCompart','compartFirstTrain',
                        'compartSecondTrain','compartAudited','status','busy')
                .where('bayNumber',monitorBay.bayNumber).first()
        .then((reg)=> { 
                if (reg) { 
                    delete reg.busy
                    knex('historyMonitorBay').insert(reg)
                    .then(()=> {
                        return(resolve())
                    })
                    .catch((err)=> {
                        return(reject(err))
                    })
                }
                else {
                    return(reject())
                }
        })
        .catch((err)=> { 
            return (reject(err))
        })
    })
}

exports.setBay = (monitorBay,callback) => {
    let result = jsonResponse()
    try { 
        applyRules(result,monitorBay)
        .then(() => {
            knex('truck').select('*').where('at',monitorBay.at).first()
            .then((reg)=> {
                if (reg) { 
                        delete monitorBay.at
                        monitorBay.truck_id = reg.id
                        knex('monitorBay').update(monitorBay).where('bayNumber',monitorBay.bayNumber)
                        .then((wasUpdated) => {
                            if (wasUpdated >0) { 
                                addHistoricalRegister(monitorBay)
                                .then(()=> { 
                                    result.msg = msgs.up_msg 
                                    result.status=200
                                })
                                .finally(()=> {
                                    if (typeof callback == 'function') callback(result) 
                                })
                            } else { 
                                result.msg = msgs.not_up_msg
                                result.status=422
                                operational_log.log('updateMonitorBay',result,monitorBay)
                                if (typeof callback == 'function') callback(result)    
                            }
                        })
                        .catch((err) => {
                            result.errStack = err
                            result.msg = db_errors.errorHandling(err)
                            result.status=422
                            operational_log.log('updateMonitorBay',result,monitorBay)
                            if (typeof callback == 'function') callback(result)
                        })
                }
                else {
                    result.status=200
                    result.msg = 'O AT informado não esta cadastrado no sistema.'
                    result.bsApproved = false 
                    if (typeof callback == 'function') callback(result)
                }
            })
            .catch((err)=> {
                result.errStack = err
                result.msg = db_errors.errorHandling(err)
                result.status=422
                operational_log.log('updateMonitorBay',result,monitorBay)
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
        operational_log.log('updateMonitorBay',result,monitorBay)
        if (typeof callback == 'function') callback(result)
    }
}

exports.clearBay = (bayNumber,callback) => {
    let result = jsonResponse()
    try {
            monitorBay = {truck_id:null,tripNumber:null,compartAudited:0,status:0,busy:0}
            knex('monitorBay').update(monitorBay).where('bayNumber',bayNumber)
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
                    operational_log.log('clear',result,monitorBay)
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

exports.getBay = (bayNumber,callback) => {
    let result = jsonResponse()    
    try { 
        knex('monitorBay').leftJoin('truck','truck.id','=','monitorBay.truck_id')
            .select('bayNumber','bayName','bayType','at','capacity','tripNumber',
            'b_train','compartFirstTrain','compartSecondTrain','totalCompart',
            'compartAudited','status','busy')
            .where('bayNumber',bayNumber)
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
                operational_log.log('getMonitorBay',result)
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

exports.allBay = (callback) => {
    let result = jsonResponse()
    try {
        knex('monitorBay').leftJoin('truck','truck.id','=','monitorBay.truck_id')
            .select('truck.id','bayNumber','bayName','bayType','at','capacity','tripNumber',
                'b_train','compartFirstTrain','compartSecondTrain','totalCompart',
                'compartAudited','status','busy')
            .orderBy('bayName')
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
                operational_log.log('allMonitorBay',result)
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








         



