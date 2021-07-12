const msgs = require('../../commons/allMessages')
const knex = require('../../database/connection')
const db_errors = require('../../commons/db_errors')
const errorsMsgs = require('../../commons/errorsMsgs')
const operational_log = require('../../commons/operational_log')
const applyRules = require('./bs_reportKeyHolder')
const jsonResponse = require('../../commons/DialogReactAndApi')
const configParameter = require('../ConfigParameter//model_configParameter')
const moment = require('moment')

const purgeReportKeyHolder = ()=> {

    return(new Promise((resolve,reject)=> { 
        let result = jsonResponse()
        configParameter.getConfigParameter({parameter:"PurgeReport"}, (configParamenterResult)=> {
            if (configParamenterResult.registers.length > 0) { 
                    let purgeDaysPeriod =  configParamenterResult.registers.shift() 

                    let dateToPurge = moment().subtract(parseInt(purgeDaysPeriod.parameterValue),'days').format('YYYY-MM-DD')
                    knex('reportkeyholderhistory').where('date','<=',dateToPurge).delete()
                    .then(()=> {
                        resolve()
                    })
                    .catch((err)=> {
                        result.errStack = err
                        result.msg = db_errors.errorHandling(err) 
                        operational_log.log('purgeReport',result)
                        reject(result)
                    })
            } else 
            {
                result.msg = 'Parâmetro de configuração - [PurgeReport] não encontrado.'
                console.log(result.msg)
                reject(result)
            }
        })
    }))
}


exports.reportAvaliableKey = (filter,callback) => {
    let result = jsonResponse()
    try { 

        purgeReportKeyHolder()
        .then(()=> { 
                applyRules(result,filter)
                .then(()=> {
                    let query = knex('reportkeyholderhistory').select('*')
                    .where('keyHolder',filter.keyHolderId)
                    
                    //Filtro - Por Range de Datas 
                    if (filter.initialDate || filter.finalDate) {
                            query.where('date','>=',`${filter.initialDate}T00:00:00`).andWhere('date','<=',`${filter.finalDate}T23:59:59`)  
                    } 
                    
                    //Filtro - Por usuário
                    filter.user && filter.user !== '' ? 
                        query.where('userLogon','like',`%${filter.user}%`) : 
                    null

                    query.then( (registers) => {
                        if (registers.length > 0) {
                            result.msg = registers.length + msgs.al_msg
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
                        operational_log.log('reportAvaliableKey',result)
                        if (typeof callback == 'function') callback(result)
                    })
                })
                .catch(()=> {
                    result.bsApproved=false 
                    result.status=200
                    if (typeof callback == 'function') callback(result)
                })
        })
        .catch((result)=> { 
            result.status=422
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