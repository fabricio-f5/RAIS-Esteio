const db_errors = require('../../commons/db_errors')
const operational_log = require('../../commons/operational_log')
const allMessages  = require('../../commons/allMessages')

function checkFieldInAction(knex,field,result,driverSms,action) {
    return new Promise((resolve,reject)=> { 
            if (!driverSms.code)  {
                result.msg= allMessages.codeRequired
                return(reject(result))
            }

            if (!driverSms.phoneNumber)  {
                result.msg= allMessages.phoneNumberRequired
                return(reject(result))
            }

            if (action == 'add') { 
                    knex('driver').where(field, driverSms[field])
                    .then( (registers) => {
                        if (registers.length > 0) {
                            result.msg='Motorista já cadastrado.'
                            return(reject(result))
                        }else {
                            return(resolve(result))
                        }
                    })
                    .catch((err) => {
                        result.errStack = err
                        result.msg = db_errors.errorHandling(err)
                        operational_log.log('bs_driverSms',result,driverSms)
                        return(reject(result))
                    })
            }
            if (action == 'update') { 
                    knex('driver').where('id','!=',driverSms.id).andWhere(field, driverSms[field])
                    .then( (registers) => {
                        if (registers.length > 0) {
                            result.msg='Motorista já cadastrado.'
                            return(reject(result))
                        }else {
                            return(resolve(result))
                        }
                    })
                    .catch((err) => {
                        result.errStack = err
                        result.msg = db_errors.errorHandling(err)
                        operational_log.log('bs_driverSms',result,driverSms)
                        return(reject(result))
                    })
            }
    })
    
}

const applyRules = function(knex,result,driverSms,action)  {

    return  Promise.all([
        checkFieldInAction(knex,'code',result,driverSms,action),
        checkFieldInAction(knex,'phoneNumber',result,driverSms,action)
   ])
    
}

module.exports = applyRules
    



