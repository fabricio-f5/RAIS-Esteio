const db_errors = require('../../commons/db_errors')
const operational_log = require('../../commons/operational_log')
const allMessages  = require('../../commons/allMessages')

function checkFieldInAction(knex,field,result,truck,action) {
    return new Promise((resolve,reject)=> { 
            if (!truck.at)  {
                result.msg= allMessages.atRequired
                return(reject(result))
            }
            
            if (!truck.capacity && truck.capacity <= 0)  {
                result.msg= allMessages.capacityRequired
                return(reject(result))
            }

            if (!truck.compartFirstTrain || truck.compartFirstTrain <= 0)  {
                result.msg= allMessages.compart_first_train_Required
                return(reject(result))
            } 

            if (truck.b_train)  {
                if (!truck.compartSecondTrain || truck.compartSecondTrain <= 0)  {
                    result.msg= allMessages.compart_second_train_Required
                    return(reject(result))
                } 
            }

            if (action == 'add') { 
                    knex('truck').where(field, truck[field])
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
                        operational_log.log('bs_truck',result,truck)
                        return(reject(result))
                    })
            }
            if (action == 'update') { 
                    knex('truck').where('id','!=',truck.id).andWhere(field, truck[field])
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
                        operational_log.log('bs_truck',result,truck)
                        return(reject(result))
                    })
            }
    })
    
}

const applyRules = function(knex,result,truck,action)  {

    return  Promise.all([
        checkFieldInAction(knex,'at',result,truck,action),
   ])
}

module.exports = applyRules
    



