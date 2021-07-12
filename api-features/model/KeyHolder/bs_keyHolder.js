const db_errors = require('../../commons/db_errors')
const operational_log = require('../../commons/operational_log')
const allMessages  = require('../../commons/allMessages')

function checkFieldInAction(knex,field,result,keyHolder,action) {
    return new Promise((resolve,reject)=> { 

            if (!keyHolder.identification.trim())  {
                result.msg= allMessages.identification
                return(reject(result))
            }
           
            if (action == 'add') { 
                    knex('keyholder').where(field, keyHolder[field])
                    .then( (registers) => {
                        if (registers.length > 0) {
                            result.msg='Claviculário já cadstrado.'
                            return(reject(result))
                        }else {
                            return(resolve(result))
                        }
                    })
                    .catch((err) => {
                        result.errStack = err
                        result.msg = db_errors.errorHandling(err)
                        operational_log.log('bs_keyHolder',result,keyHolder)
                        return(reject(result))
                    })
            }
            if (action == 'update') { 
                    knex('keyholder').where('id','!=',keyHolder.id).andWhere(field, keyHolder[field])
                    .then( (registers) => {
                        if (registers.length > 0) {
                            result.msg='Claviculário já cadstrado.'
                            return(reject(result))
                        }else {
                            return(resolve(result))
                        }
                    })
                    .catch((err) => {
                        result.errStack = err
                        result.msg = db_errors.errorHandling(err)
                        operational_log.log('bs_keyHolder',result,keyHolder)
                        return(reject(result))
                    })
            }
    })
    
}

const applyRules = function(knex,result,keyHolder,action)  {

    return  Promise.all([
        checkFieldInAction(knex,'identification',result,keyHolder,action),
        checkFieldInAction(knex,'number',result,keyHolder,action)
   ])
    
}

module.exports = applyRules
    



