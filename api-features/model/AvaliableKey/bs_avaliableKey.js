const db_errors = require('../../commons/db_errors')
const operational_log = require('../../commons/operational_log')
const allMessages  = require('../../commons/allMessages')

function checkFieldInAction(knex,field,result,avaliableKey,action) {
    return new Promise((resolve,reject)=> { 

            if (isNaN(parseInt(avaliableKey.number)))  {
                result.msg= allMessages.keyNumberRequired
                return(reject(result))
            }

            if (action == 'add') { 
                if (avaliableKey[field] != '' && avaliableKey[field] != null) { 
                    knex('avaliablekey').where(field, avaliableKey[field]).andWhere('keyHolder_id',avaliableKey.keyHolder_id)
                    .then( (registers) => {
                        if (registers.length > 0) {
                            result.msg='Chave já cadstrado.'
                            return(reject(result))
                        }else {
                            return(resolve(result))
                        }
                    })
                    .catch((err) => {
                        result.errStack = err
                        result.msg = db_errors.errorHandling(err)
                        operational_log.log('bs_avaliableKey',result,avaliableKey)
                        return(reject(result))
                    })
                }
                else  {
                    return(resolve(result))
                }
            }
            if (action == 'update') { 
                    if (avaliableKey[field] != '' && avaliableKey[field] != null) { 
                        knex('avaliablekey').where('id','!=',avaliableKey.id).andWhere('keyHolder_id',avaliableKey.keyHolder_id).andWhere(field, avaliableKey[field])
                        .then( (registers) => {
                            if (registers.length > 0) {
                                result.msg='Chave já cadstrado.'
                                return(reject(result))
                            }else {
                                return(resolve(result))
                            }
                        })
                        .catch((err) => {
                            result.errStack = err
                            result.msg = db_errors.errorHandling(err)
                            operational_log.log('bs_avaliableKey',result,avaliableKey)
                            return(reject(result))
                        })
                    }
                    else  {
                        return(resolve(result))
                    }
            }
    })
    
}

const applyRules = function(knex,result,avaliableKey,action)  {

    return  Promise.all([
        checkFieldInAction(knex,'number',result,avaliableKey,action),
        checkFieldInAction(knex,'description',result,avaliableKey,action)
   ])
    
}

module.exports = applyRules
    



