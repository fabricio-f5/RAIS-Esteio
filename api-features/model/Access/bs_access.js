const allMessage = require('../../commons/allMessages')

const applyRules = function(knex,result,user,action)  {
    result.bsApproved = false 

    return new Promise((resolve,reject)=> { 
        
        if (action === 'firstLogin') {
                if (!user.email.trim())  {
                    result.msg= allMessage.emailRequired
                    return(reject(result))
                }

                if (!user.password.trim())  {
                    result.msg= allMessage.passwordRequired
                    return(reject(result))
                }
        }

        if (action === 'login') {
            if (!user.email.trim() && !user.logonUser.trim())  {
                result.msg= allMessage.credentialRequired
                return(reject(result))
            }

            if (!user.password.trim())  {
                result.msg= allMessage.passwordRequired
                return(reject(result))
            }
    }

        if (action === 'recoveryPass') {
            if (!user.email)  {
                result.msg= allMessage.emailRequired
                return(reject(result))
            }

            if (!user.cpf)  {
                result.msg= allMessage.cpfRequired
                return(reject(result))
            }
        }

        if (action === 'changePass') {

            if (!user.password)  {
                result.msg= allMessage.passwordRequired
                return(reject(result))
            }

            if (!user.confirmPassword)  {
                result.msg= allMessage.confirmPassword
                return(reject(result))
            }

            if (user.password !== user.confirmPassword)  {
                result.msg= allMessage.PasswordNotConfirmed
                return(reject(result))
            }
            if (!user.password.match("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,}")) { 
                result.msg= allMessage.PasswordValidation
                return(reject(result))
            }

        }
        
        result.bsApproved = true
        resolve(result)
    })
}

module.exports = applyRules