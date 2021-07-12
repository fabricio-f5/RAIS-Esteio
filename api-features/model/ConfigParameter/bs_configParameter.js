const db_errors = require('../../commons/db_errors')
const operational_log = require('../../commons/operational_log')
const allMessages  = require('../../commons/allMessages')

function checkFieldInAction(knex,field,result,configParameter,action) {
    return new Promise((resolve,reject)=> { 

            if (!configParameter.parameter.trim())  {
                result.msg= allMessages.parameterRequired
                return(reject(result))
            }

            if (!configParameter.description.trim())  {
                result.msg= allMessages.descriptionRequired
                return(reject(result))
            }

            if (!configParameter.parameterValue)  {
                result.msg= allMessages.parameterValueRequired
                return(reject(result))
            }

            if (action == 'add') { 
                    knex('configparameter').where(field, configParameter[field])
                    .then( (registers) => {
                        if (registers.length > 0) {
                            result.msg='Parâmetro já cadastrado.'
                            return(reject(result))
                        }else {
                            return(resolve(result))
                        }
                    })
                    .catch((err) => {
                        result.errStack = err
                        result.msg = db_errors.errorHandling(err)
                        operational_log.log('bs_configParameter',result,configParameter)
                        return(reject(result))
                    })
            }
            if (action == 'update') { 
                    knex('configparameter').where('id','!=',configParameter.id).andWhere(field, configParameter[field])
                    .then( (registers) => {
                        if (registers.length > 0) {
                            result.msg='Parâmetro já cadastrado.'
                            return(reject(result))
                        }else {
                            return(resolve(result))
                        }
                    })
                    .catch((err) => {
                        result.errStack = err
                        result.msg = db_errors.errorHandling(err)
                        operational_log.log('bs_configParameter',result,configParameter)
                        return(reject(result))
                    })
            }
    })
    
}

const applyRules = function(knex,result,configParameter,action)  {

    return  Promise.all([
        checkFieldInAction(knex,'parameter',result,configParameter,action)
   ])
    
}

module.exports = applyRules
    



