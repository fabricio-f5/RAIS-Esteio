const db_errors = require('../../commons/db_errors')
const operational_log = require('../../commons/operational_log')
const allMessages  = require('../../commons/allMessages')

function checkFieldInAction(knex,field,result,user,action) {

    return new Promise((resolve,reject)=> { 

            if (user.profile_id <= 0)  {
                result.msg= allMessages.profileRequired
                return(reject(result))
            }
        
            if (!user.name.trim())  {
                result.msg= allMessages.nameRequired
                return(reject(result))
            }

            if (!user.email.trim())  {
                result.msg= allMessages.emailRequired
                return(reject(result))
            }

            if (!user.logonUser.trim())  {
                if (!user.email.trim()) { 
                    result.msg= allMessages.logonUserRequired
                    return(reject(result))
                }
            }

            if (action == 'add') { 
                    knex('user').where(field, user[field])
                    .then( (registers) => {
                        if (registers.length > 0) {
                            result.msg='Usuário já cadastrado.'
                            return(reject(result))
                        }else {
                            return(resolve(result))
                        }
                    })
                    .catch((err) => {
                        result.errStack = err
                        result.msg = db_errors.errorHandling(err)
                        operational_log.log('bs_user',result,user)
                        return(reject(result))
                    })
            }
            if (action == 'update') { 
                    knex('user').where('id','!=',user.id).andWhere(field, user[field])
                    .then( (registers) => {
                        if (registers.length > 0) {
                            result.msg='Usuário já cadastrado.'
                            return(reject(result))
                        }else {
                            result.bsApproved = true
                            return(resolve(result))
                        }
                    })
                    .catch((err) => {
                        result.errStack = err
                        result.msg = db_errors.errorHandling(err)
                        operational_log.log('bs_user',result,user)
                        return(reject(result))
                    })
            }
    })
    
}

const applyRules = function(knex,result,user,action)  {

    return  Promise.all([
             checkFieldInAction(knex,'email',result,user,action),
             checkFieldInAction(knex,'logonUser',result,user,action)
        ])

}
module.exports = applyRules
    



