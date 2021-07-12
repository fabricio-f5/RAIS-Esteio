const msgs = require('../../commons/allMessages')
const knex = require('../../database/connection')
const db_errors = require('../../commons/db_errors')
const errorsMsgs = require('../../commons/errorsMsgs')
const operational_log = require('../../commons/operational_log')
const applyRules = require('./bs_reportOverfill')
const jsonResponse = require('../../commons/DialogReactAndApi')
const moment = require('moment')

const purgeReportOverfill = (purgeDaysPeriod)=> {

    return(new Promise((resolve,reject)=> { 
        let result = jsonResponse()
            let dateToPurge = moment().subtract(parseInt(purgeDaysPeriod),'days').format('YYYY-MM-DD')
            knex('historyMonitorBay').where('date','<=',dateToPurge).delete()
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


exports.reportOverfill = (filter,purgeDaysPeriod,callback) => {
    let result = jsonResponse()
    try { 

        purgeReportOverfill(purgeDaysPeriod)
        .then(()=> { 
                applyRules(result,filter)
                .then(()=> {
                    let query =  knex('historyMonitorBay')
                                .select('date','bayNumber','bayName','bayType','at',
                                        'b_train','compartFirstTrain','compartSecondTrain',
                                        'totalCompart','compartAudited','status')
                    
                    
                    //Filtro - Por Range de Datas 
                    if (filter.initialDate || filter.finalDate) {
                            query.where('date','>=',`${filter.initialDate}T00:00:00`).andWhere('date','<=',`${filter.finalDate}T23:59:59`)  
                    } 
                    
                    //Filtro - Por Placa
                    filter.at && filter.at !== '' ? 
                        query.where('at','like',`%${filter.at}%`) : 
                    null

                    //Filtro - Por Número de Baia
                    filter.bayNumber ? 
                        query.where('bayNumber','=',filter.bayNumber) : 
                    null

                    //Filtro - Por Situação da Baia
                    filter.status ? 
                        query.where('status','=',filter.status) : 
                    null

                    //Filtro - Por tipo de Carreta
                    filter.b_train ? 
                    query.where('b_train','=',filter.b_train) : 
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
                        operational_log.log('reportOverfill',result)
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