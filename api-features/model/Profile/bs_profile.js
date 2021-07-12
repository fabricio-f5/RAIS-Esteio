const db_errors = require('../../commons/db_errors')
const operational_log = require('../../commons/operational_log')
const allMessages  = require('../../commons/allMessages')

function checkFieldInAction(knex,field,result,profile,action) {
    return new Promise((resolve,reject)=> { 

            if (!profile.name.trim())  {
                result.msg= allMessages.nameRequired
                return(reject(result))
            }

            if (!profile.description.trim())  {
                result.msg= allMessages.nameRequired
                return(reject(result))
            }

            if (!profile.profileNumber && !profile.profileNumber > 1)  {
                result.msg= allMessages.nameRequired
                return(reject(result))
            }

            if (!profile.accessLevel || !profile.accessLevel > 1)  {
                result.msg= allMessages.profileAccessLevel
                return(reject(result))
            }


            if (action == 'add') { 
                    knex('profile').where(field, profile[field])
                    .then( (registers) => {
                        if (registers.length > 0) {
                            result.msg='Perfil já cadastrado.'
                            return(reject(result))
                        }else {
                            return(resolve(result))
                        }
                    })
                    .catch((err) => {
                        result.errStack = err
                        result.msg = db_errors.errorHandling(err)
                        operational_log.log('bs_profile',result,profile)
                        return(reject(result))
                    })
            }
            if (action == 'update') { 
                    knex('profile').where('id','!=',profile.id).andWhere(field, profile[field])
                    .then( (registers) => {
                        if (registers.length > 0) {
                            result.msg='Perfil já cadastrado.'
                            return(reject(result))
                        }else {
                            return(resolve(result))
                        }
                    })
                    .catch((err) => {
                        result.errStack = err
                        result.msg = db_errors.errorHandling(err)
                        operational_log.log('bs_profile',result,profile)
                        return(reject(result))
                    })
            }
    })
    
}

const applyRules = function(knex,result,profile,action)  {


    return  Promise.all([
        checkFieldInAction(knex,'name',result,profile,action)
   ])
}
module.exports = applyRules
    



