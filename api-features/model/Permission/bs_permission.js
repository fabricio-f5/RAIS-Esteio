const db_errors = require('../../commons/db_errors')
const operational_log = require('../../commons/operational_log')
const allMessages  = require('../../commons/allMessages')

function checkFieldInAction(knex,field,result,permission,action) {
    return new Promise((resolve,reject)=> { 

            if (permission.profile_id === undefined || permission.profile_id < 0)  {
                result.msg= allMessages.profileRequired
                return(reject(result))
            }

            if (permission.route_id === undefined || permission.route_id < 0)  {
                result.msg= allMessages.routeRequired
                return(reject(result))
            }

            if (action == 'add') { 
                    knex('permission').where(field, permission[field])
                    .then( (registers) => {
                        if (registers.length > 0) {
                            result.msg='Permissão já definida.'
                            return(reject(result))
                        }else {
                            return(resolve(result))
                        }
                    })
                    .catch((err) => {
                        result.errStack = err
                        result.msg = db_errors.errorHandling(err)
                        operational_log.log('bs_permission',result,permission)
                        return(reject(result))
                    })
            }
            if (action == 'update') { 
                    knex('permission').where('id','!=',permission.id).andWhere(field, permission[field])
                    .then( (registers) => {
                        if (registers.length > 0) {
                            result.msg='Permissão já definida.'
                            return(reject(result))
                        }else {
                            return(resolve(result))
                        }
                    })
                    .catch((err) => {
                        result.errStack = err
                        result.msg = db_errors.errorHandling(err)
                        operational_log.log('bs_permission',result,permission)
                        return(reject(result))
                    })
            }
    })
    
}

const applyRules = function(knex,result,permission,action)  {
    return Promise.all([
        checkFieldInAction(knex,'profile_id',result,permission,action),
        checkFieldInAction(knex,'route_id',result,permission,action)
    ])
}
module.exports = applyRules
    



