const msgs = require('../../commons/allMessages')
const knex = require('../../database/connection')
const db_errors = require('../../commons/db_errors')
const errorsMsgs = require('../../commons/errorsMsgs')
const operational_log = require('../../commons/operational_log')
const applyRules = require('./bs_multiloadControl')
const jsonResponse = require('../../commons/DialogReactAndApi')
const runChildProcess = require('child_process')
const { promises } = require('stream')
const moment = require('moment')


exports.addMultiload = (multiload,callback) => {
let result = jsonResponse()
    try {
                applyRules(knex,result,multiload,'add')
                .then(() => {
                    knex('multiloadControl').insert(multiload)
                        .then(() => {
                            result.msg = msgs.ad_msg
                            result.status=201
                            operational_log.log('addMultiload',result,multiload)
                        })    
                        .catch((err) => {
                            result.errStack = err
                            result.msg = db_errors.errorHandling(err)
                            result.status=422
                        })
                        .finally(() => { 
                            operational_log.log('addMultiload',result,multiload)
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

const getHistoricalRegisterToUpdate = (bayNumber,user,statusField,statusValue,reason) => {
    let result = jsonResponse()
    return new Promise((resolve,reject)=> {

        let myDate =  moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
        let query = knex('historyMultiloadControl').select('*')
        
        switch (statusField) {
            case 'bayStatus':
                query.where('bayNumber',bayNumber)
                     .where('action','Acesso')
                     .where('user',user)
                     .where('bayStatus',parseInt(statusValue) === 1 ? 0 : 1)
                     .where('actionDateOFF',null)
                .update('actionDateOFF',myDate).update('bayStatus',parseInt(statusValue))   
                break

            case 'measureStatus':
                query.where('bayNumber',bayNumber)
                     .where('action','Aferição')
                     .where('user',user)
                     .where('measureStatus',parseInt(statusValue) === 1 ? 0 : 1)
                     .where('actionDateOFF',null)
                     .update('actionDateOFF',myDate).update('measureStatus',parseInt(statusValue))   
                break
            case 'maintenanceStatus':
                query.where('bayNumber',bayNumber).where('user',user)
                     .where('action','Manutenção')
                     .where('maintenanceStatus',parseInt(statusValue) === 1 ? 0 : 1)
                     .where('actionDateOFF',null)
                .update('actionDateOFF',myDate).update('maintenanceStatus',parseInt(statusValue))  
                break

            default:
                break
        } 
                    
        query
        .then((res)=> {
            console.log(res)
            return(resolve())
        })
        .catch((err)=> {
            result.errStack = err
            result.msg = db_errors.errorHandling(err)
            result.status=422
            return(reject(result))
        })
       
    })
}

const addHistoricalRegister = (bayNumber,user,reason,statusField,statusValue) => {
    return new Promise((resolve,reject)=> {
        let result =  jsonResponse()   
        let myDate =  moment(new Date()).format("YYYY-MM-DD HH:mm:ss")

        knex('multiloadControl').select('*')
        .where('bayNumber',bayNumber).first()
        .then((reg)=> { 
                if (reg) { 
                    let query = null
                    let reportObj = {user:user,
                                     platform:reg.platform,
                                     bayNumber:bayNumber,
                                     bayName:reg.bayName,
                                     reason:reason}
                    
                    switch (statusField) {
                    case 'bayStatus':
                          reportObj.bayStatus = statusValue
                          reportObj.action = 'Acesso ML'
                          if (parseInt(statusValue) ===1) { 
                            reportObj.actionDateON = myDate
                            query = knex('historyMultiloadControl').insert(reportObj)          
                          } else {
                            getHistoricalRegisterToUpdate(reportObj.bayNumber,reportObj.user,statusField,statusValue,reason)
                            .then(()=>{
                                return(resolve())
                            })
                            .catch((result)=> {
                                return(reject(result))
                            })
                          }
                        break
                    case 'measureStatus':
                         reportObj.measureStatus = statusValue
                         reportObj.action = 'Aferição'
                         if (parseInt(statusValue) ===1) { 
                            reportObj.actionDateON = myDate
                            query = knex('historyMultiloadControl').insert(reportObj)          
                        } else {
                            getHistoricalRegisterToUpdate(reportObj.bayNumber,reportObj.user,statusField,statusValue,reason)
                            .then(()=>{
                                return(resolve())  
                            })
                            .catch((result)=> {
                                return(reject(result))
                            })
                        }
                         break
                    case 'maintenanceStatus':
                        reportObj.maintenanceStatus = statusValue
                        reportObj.action = 'Manutenção'
                        if (parseInt(statusValue) ===1) { 
                            reportObj.actionDateON = myDate
                            query = knex('historyMultiloadControl').insert(reportObj)          
                        } else {
                            getHistoricalRegisterToUpdate(reportObj.bayNumber,reportObj.user,statusField,statusValue,reason)
                            .then(()=>{
                                return(resolve())    
                            })
                            .catch((result)=> {
                                return(reject(result))
                            })
                        }
                        break
                    default:
                        break
                    }    

                    if(query) { 
                        query
                        .then(()=> {
                            return(resolve())
                        })
                        .catch((err)=> {
                            result.errStack = err
                            result.msg = db_errors.errorHandling(err)
                            result.status=422
                            return(reject(result))
                        })
                    }
                }
                else {
                    result.errStack = err
                    result.msg = `Tentamos gerar os dados para histórico, mas tivemos problemas em encontrar os dados 
                    conforme o número da baia que nos foi passado. Baia:${bayNumber}.`
                    result.status=422
                    return(reject(result))
                }
        })
        .catch((err)=> { 
            return (reject(err))
        })
    })
}

exports.execScript = (bayNumber,statusField,statusValue) => {
    let result = jsonResponse()
    return new Promise((resolve,reject)=> {

        let query = null
        
        switch (statusField) {
            case 'bayStatus':
                query = knex('multiloadControl').select('bayScriptPath as script','ip','bayStatus','measureStatus').where('bayNumber',bayNumber) 
                break;
            case 'measureStatus':
                query = knex('multiloadControl').select('measureScriptPath as script','ip','bayStatus','measureStatus').where('bayNumber',bayNumber)
                break;
            case 'maintenanceStatus':
                query = knex('multiloadControl').select('maintenanceScriptPath as script','ip','bayStatus','measureStatus').where('bayNumber',bayNumber) 
                break;
            default:
                query = null
        }

        if (query) { 

            query.then((regs) => { 
                if (regs.length > 0) { 
                    let reg = regs[0]
                    let permitExecution = true 
                    let msgAccess = 'Libere o acesso ao Multiload antes de tentar configurá-lo.'

                    switch (statusField) {
                        case 'bayStatus':
                            if (reg.bayStatus === 1 && reg.measureStatus === 1) { 
                                permitExecution = false
                                msgAccess = 'Para Bloquear o ML é necessário tirá-lo do modo Aferição.'
                            } else {
                                permitExecution = true
                            }
                            
                            break
                        case 'measureStatus':
                            if (reg.bayStatus === 0) {
                                permitExecution = false
                                break
                            }
                            break
                        case 'maintenanceStatus':
                            if (reg.bayStatus === 1) {
                                permitExecution = false 
                                msgAccess = 'Para colocar o Multiload em Manutenção e/ou retirá-lo de manutenção, é necessário que ele esteja bloqueado.'
                            }
                            break
                        default:
                            permitExecution = true 
                    }
                   
                    if (permitExecution === true) { 
                            runChildProcess.exec(`${reg.script} ${reg.ip} ${statusValue}`,
                            (error, stdout, stderr) => {
                                result.status=200
                                if (error) {
                                    _msg = `${reg.script}: ${error}`
                                    result.status=422
                                    console.error(_msg)
                                    result.msg = 'Falha na execução da operação.'
                                    result.errStack = error
                                    reject(result)
                                    
                                } else {
                                    resolve()
                                }
                            })
                    }
                    else {
                        result.status=422
                        result.msg = msgAccess
                        reject(result)
                    }
                }
                else {
                    result.status=422
                    result.msg = `Não encontrei o nome do script configurado no registro da baia número ${bayNymber}.`
                    reject(result)
                }
            })
            .catch((err) => {
                result.status=422
                result.errStack = err
                result.msg = db_errors.errorHandling(err)
                reject(result)
            })

        }else { 
            result.status=422
            _msg =  ` O nome da coluna referente ao status a ser alterado não existe no banco de dados.`
            console.error(_msg)
            result.msg = _msg
            reject(result)
        }

    })
   
}


exports.setStatusMultiload = (data,statusField,statusValue,callback) => {
    let result = jsonResponse()
    
    try { 
        this.execScript(data.bayNumber,statusField,statusValue)
        .then(()=> { 
            knex('multiloadControl').update(`${statusField}`,`${statusValue}`).where('bayNumber',data.bayNumber)
            .then((wasUpdated) => {
                if (wasUpdated >0) { 
                    addHistoricalRegister(data.bayNumber,data.user,data.reason,statusField,statusValue)
                    .then(()=> { 
                        result.msg = msgs.up_msg 
                        result.status=200
                        if (typeof callback == 'function') callback(result)
                    })
                    .catch((result)=> {
                        if (typeof callback == 'function') callback(result)
                    })
                } else { 
                    result.msg = msgs.not_up_msg
                    result.status=422
                    operational_log.log('setStatusMultiload',result,multiload)
                    if (typeof callback == 'function') callback(result)    
                }
            })
            .catch((err) => {
                result.errStack = err
                result.msg = db_errors.errorHandling(err)
                result.status=422
                operational_log.log('setStatusMultiload',result,multiload)
                if (typeof callback == 'function') callback(result)
            })
        })
        .catch((result)=> {
            if (typeof callback == 'function') callback(result)
        })

    }
    catch(err) {
        result.status=422
        result.errStack = err
        errorsMsgs.errorHandling(err.message)
        operational_log.log('setStatusMultiload',result,multiload)
        if (typeof callback == 'function') callback(result)
    }
}


exports.updateMultiload = (multiload,callback) => {
    let result = jsonResponse()
    try { 
        applyRules(knex,result,multiload,'update')
        .then(() => {

            knex('multiloadControl').update(multiload).where('id',multiload.id)
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
                    operational_log.log('updateMultiload',result,multiload)
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

exports.deleteMultiload = (id,callback) => {
    let result = jsonResponse()
    try {
        knex('multiloadControl').where('id',id)
            .then((element) => { 
                if (element.length > 0) {
                    knex('multiloadControl').where('id',id).delete()
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
                        operational_log.log('deleteMultiload',result,id)
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

exports.editMultiload = (id,callback) => {
    let result = jsonResponse()    
    try { 
        knex('multiloadControl').where('id',id)
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
                operational_log.log('editMultiload',result,id)
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

exports.getMultiload = (bayNumber,callback) => {
    let result = jsonResponse()    
    try { 
        knex('multiloadControl').where('bayNumber',bayNumber).orderBy('bayNumber')
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
                operational_log.log('getMultiload',result)
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

exports.allMultiload = (callback) => {
    let result = jsonResponse()
    try {
        knex('multiloadControl').select('*').orderBy('bayNumber')
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
                operational_log.log('allMultiload',result)
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

exports.reportMultiload = (filter,callback) => {
    let result = jsonResponse()
    try { 
        let whereClause=''
        if (filter.value != '') { 
            whereClause = "where " + filter.field + " like '%" + filter.value + "%'"
        }
                
        knex.raw('Select * from multiloadControl ' + whereClause)
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
                operational_log.log('reportMultiload',result)
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









         



