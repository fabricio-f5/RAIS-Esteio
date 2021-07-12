const db_errors = require('../../commons/db_errors')
const operational_log = require('../../commons/operational_log')
const allMessages  = require('../../commons/allMessages')

function checkFieldInAction(knex,field,result,multiload,action) {
    return new Promise((resolve,reject)=> { 
            if (!multiload.bayNumber)  {
                result.msg= allMessages.bayNumberRequired
                return(reject(result))
            }

            if (action == 'add') { 
                    knex('multiloadControl').where(field, multiload[field])
                    .then( (registers) => {
                        if (registers.length > 0) {
                            result.msg='Baia já cadastrado.'
                            return(reject(result))
                        }else {
                            return(resolve(result))
                        }
                    })
                    .catch((err) => {
                        result.errStack = err
                        result.msg = db_errors.errorHandling(err)
                        operational_log.log('bs_multiload',result,multiload)
                        return(reject(result))
                    })
            }
            if (action == 'update') { 
                    knex('multiloadControl').where('id','!=',multiload.id).andWhere(field, multiload[field])
                    .then( (registers) => {
                        if (registers.length > 0) {
                            result.msg='AT já cadastrado.'
                            return(reject(result))
                        }else {
                            return(resolve(result))
                        }
                    })
                    .catch((err) => {
                        result.errStack = err
                        result.msg = db_errors.errorHandling(err)
                        operational_log.log('bs_multiload',result,multiload)
                        return(reject(result))
                    })
            }
    })
    
}

const applyRules = function(knex,result,multiload,action)  {

    return  Promise.all([
        checkFieldInAction(knex,'bayNumber',result,multiload,action),
   ])
}

module.exports = applyRules
    



