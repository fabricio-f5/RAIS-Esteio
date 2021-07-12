const db_errors = require('../../commons/db_errors')
const operational_log = require('../../commons/operational_log')
const allMessages  = require('../../commons/allMessages')

function checkFieldInAction(knex,field,result,routePermission,action) {
    
    return new Promise((resolve,reject)=> { 

            if (!routePermission.route.trim())  {
                result.msg= allMessages.routeRequired
                return(reject(result))
            }

            if (!routePermission.description.trim())  {
                result.msg= allMessages.descriptionRequired
                return(reject(result))
            }

            if (action == 'add') { 
                    knex('route').where(field, routePermission[field])
                    .then( (registers) => {
                        if (registers.length > 0) {
                            result.msg=' Rota já cadastrada.'
                            return(reject(result))
                        }else {
                            return(resolve(result))
                        }
                    })
                    .catch((err) => {
                        result.errStack = err
                        result.msg = db_errors.errorHandling(err)
                        operational_log.log('bs_routePermission',result,routePermission)
                        return(reject(result))
                    })
            }
            if (action == 'update') { 
                    knex('route').where('id','!=',routePermission.id).andWhere(field, routePermission[field])
                    .then( (registers) => {
                        if (registers.length > 0) {
                            result.msg=' Rota já cadastrada.'
                            return(reject(result))
                        }else {
                            return(resolve(result))
                        }
                    })
                    .catch((err) => {
                        result.errStack = err
                        result.msg = db_errors.errorHandling(err)
                        operational_log.log('bs_routePermission',result,routePermission)
                        return(reject(result))
                    })
            }
    })
    
}

const applyRules = function(knex,result,routePermission,action)  {

    return new Promise((resolve,reject)=> { 
        checkFieldInAction(knex,'route',result,routePermission,action)
        .then(()=> {
            resolve(result) 
        })
        .catch(()=> {
            reject(result)
        })
    })
}
module.exports = applyRules
    



