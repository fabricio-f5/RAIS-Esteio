const msgs = require('../../commons/allMessages')
const knex = require('../../database/connection')
const db_errors = require('../../commons/db_errors')
const errorsMsgs = require('../../commons/errorsMsgs')
const operational_log = require('../../commons/operational_log')
const applyRules = require('./bs_reportMultiloadControl')
const jsonResponse = require('../../commons/DialogReactAndApi')
const moment = require('moment')

const purgeReportMultiloadControl = (purgeDaysPeriod)=> {

    return(new Promise((resolve,reject)=> { 
        let result = jsonResponse()
            let dateToPurge = moment().subtract(parseInt(purgeDaysPeriod),'days').format('YYYY-MM-DD')
            knex('historyMultiloadControl').where('date','<=',dateToPurge).delete()
            .then(()=> {
                resolve()
            })
            .catch((err)=> {
                result.errStack = err
                result.msg = db_errors.errorHandling(err) 
                operational_log.log('purgeReport',result)
                reject(result)
            })
    }))
}


exports.reportMultiloadControl = (filter,purgeDaysPeriod,callback) => {
    let result = jsonResponse()
    try { 

        purgeReportMultiloadControl(purgeDaysPeriod)
        .then(()=> { 
                applyRules(result,filter)
                .then(()=> {
                    let query =  knex('historyMultiloadControl')
                                .select('date','platform','bayName','user','action','actionDateON','actionDateOFF','reason')

                    //Filtro - Por Range de Datas 
                    if (filter.initialDate || filter.finalDate) {
                            query.where('date','>=',`${filter.initialDate}T00:00:00`).andWhere('date','<=',`${filter.finalDate}T23:59:59`)  
                    } 
                    
                    //Filtro - Por Usuário
                    filter.user && filter.user !== '' ? 
                        query.where('user','like',`%${filter.user}%`) : 
                    null

                    //Filtro - Por Nome da Baia
                    filter.bayName && filter.bayName !== '' ? 
                        query.where('bayName','like',`%${filter.bayName}%`) : 
                    null

                    //Filtro - Por Nome da Baia
                    if (filter.action && filter.action) {
                        switch (filter.action) { 
                            case '1':
                                query.where('action','Acesso ML') 
                                break
                            case '2':
                                query.where('action','Aferição') 
                                break
                            case '3':
                                query.where('action','Manutenção') 
                                break
                            default:
                                break
                        }
                    }

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
                        operational_log.log('reportMultiloadControl',result)
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