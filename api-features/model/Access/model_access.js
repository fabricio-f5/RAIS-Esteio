const knex = require('../../database/connection')
const jsonResponse = require('../../commons/DialogReactAndApi')
const applyRules = require('./bs_access')
const applyUserRules = require('../User/bs_user')
const db_errors = require('../../commons/db_errors')
const errorsMsgs = require('../../commons/errorsMsgs')
const operational_log = require('../../commons/operational_log')
const crypto = require('../../commons/cripto')
const msgs = require('../../commons/allMessages')
const sendMail = require('../../commons/nodemail')
const jwt = require('jsonwebtoken')
const secret = require('../../config/secret')
const envVar = require('../../config/envConfig')
const profile = require('../Profile/model_profile')
const TOKEN_EXP = '2d'

//#region - Especificação
    //Este método é utlizado quando o usuário cria a sua própria conta no sistema. A comunicação,
    //para validação e confirmação do cadastro ocorre por envio de email.
//#endregion
exports.registerUser = (user,callback) => {
    let result = jsonResponse()
    try {

            if (user.password) {
                user.password = crypto.encrypt(user.password)
            }

            profile.getProfile('1',(result) => {
                let profile_id = result.registers.length > 0 ? result.registers[0].id : undefined
                if (profile_id >=0) { 
                    //Quando o próprio usuário realiza o cadastra de sua conta no sistema, o perfil
                    // de sistema de número 1 é atribuído a ele automaticamente diferenciando o mesmo 
                    //do owner do sistema.
                    user.profile_id = profile_id   

                    applyUserRules(knex,result,user,'add')
                    .then(() => {
                           
                       knex('user').insert(user)
                       .then((userId) => { 
                            result.status=200
                            result.msg = msgs.ad_msg

                           //JWT - Json Web Token.
                           let  identification = userId[0]
                           let  token = jwt.sign({id:identification,email:user.email},secret)
                                       
                               if (!user.status) {
                                   let mensagem = `Clique no link e realize a confirmação de seu cadastro - http://${envVar.envWebAppHost}/login/${token}` 
                                   sendMail(user.email,user.name, mensagem)
                                   .then((success)=> {
                                       result = success
                                   })
                                   .catch((error)=> {
                                       result = error
                                       knex('user').delete(user)
                                        .then(() => {
                                            console.error('[registerUser]-Não foi possível enviar o e-mail para o usuário.Usuário excluído, um novo processo deve começar.')
                                        })
                                        .catch((err)=> {
                                                result.errStack = err
                                                result.msg = db_errors.errorHandling(err)
                                                result.status=422
                                        })
                                        .finally(()=> {
                                                operational_log.log('registerUser',result,user)
                                                if (typeof callback == 'function') callback(result)    
                                        })
                                   })
                                   .finally(() => { 
                                       operational_log.log('registerUser',result,user)
                                       if (typeof callback == 'function') callback(result)
                                   })
                               }
                       })
                       .catch((err) => {
                           result.errStack = err
                           result.msg = db_errors.errorHandling(err)
                           result.status=422
                           if (typeof callback == 'function') callback(result)
                       })
                   })
                   .catch((result) => {
                       result.status=200
                       if (typeof callback == 'function') callback(result)
                   })
                }
                else {
                    result.status = 422
                    result.msg= msgs.ProfileNotFound    
                    operational_log.log('registerUser',result,user)
                    if (typeof callback == 'function') callback(result)
                }
            })
    }
    catch(err) {
        result.status=422
        result.errStack = err
        errorsMsgs.errorHandling(err.message)
        if (typeof callback == 'function') callback(result)
    }
}

//#region - Especificação
    //  Este método é utilizado apenas no primeiro login do usuário. Ao receber o e-mail para confirmação 
    //  de seu cadastro no sistema, e acionar o link contido na msg para confirmação, o mesmo é direcionado
    //  para o firstLogin onde é verifica a autenticidade do usuário através do token recebido. Tendo a 
    //  autenticidade confirmada o mesmo é ativado no sistema e um token é criado para que seja enviado ao 
    // cliente estando ele autorizado a executar métodos da api.
//#endregion
exports.firstLogin = (tokenMail,user,callback) => {
    let result = jsonResponse()
    try {
        let payload = jwt.verify(tokenMail,secret)
        applyRules(knex,result,user,'firstLogin')
        .then((result) => {
            
            knex('user').where('id',payload.id).andWhere('email',payload.email).andWhere('status',false)
                .then((registers)=> {
                    result.status = 200
                    if (registers.length >0) {

                        //Verifica se o Usuário foi desativado
                        if (registers[0].activated === 0)  {
                            result.status = 403
                            result.msg= msgs.userNotActivated
                            if (typeof callback == 'function') callback(result)
                        }

                        let password = crypto.decrypt(registers[0].password)
                        if (password === user.password) {

                            //JWT - Json Web Token.
                            let  identification = registers[0].id
                            let  token = jwt.sign({id:identification,email:user.email},secret, { expiresIn: TOKEN_EXP })    

                            knex('user').where('id',identification).andWhere('email',payload.email).andWhere('status',false).update({ status: true,lastLogin: new Date() })
                                .then(()=> {
                                    knex('permission').join('route','permission.route_id','route.id').where('profile_id',registers[0].profile_id)
                                    .select('route.route','permission.profile_id','permission.write','permission.read','permission.delete')
                                    .then((permissions)=> {
                                        if (permissions.length > 0) {
                                            result.status=200   
                                            result.msg = msgs.successedLogin 
                                            result.registers = registers
                                            result.permission = permissions
                                            result.token = token 
                                            result.auth = true
                                            user.password=''
                                        }else {
                                            result.msg = msgs.registerNotFound
                                            result.status=404
                                        }
                                       
                                        operational_log.log('login',result,user)
                                        if (typeof callback == 'function') callback(result)
                                    })
                                    .catch((err)=> {
                                        result.errStack = err
                                        result.msg = db_errors.errorHandling(err)
                                        result.status=422  
                                        if (typeof callback == 'function') callback(result)  
                                    })
                                })
                        } 
                        else {
                            result.status = 422
                            result.msg= msgs.passwordIncorrect
                            if (typeof callback == 'function') callback(result)
                        }
                    }else  {
                        result.status = 422
                        result.msg= msgs.UserNotFound_FirstLogin
                        if (typeof callback == 'function') callback(result)
                    }
                    
                })
                .catch((err) => {
                    result.status=422
                    result.errStack = err
                    result.msg = db_errors.errorHandling(err)
                    if (typeof callback == 'function') callback(result)
                })
        })
        .catch(()=> {
            result.status=200
            if (typeof callback == 'function') callback(result)
        })
    } 
    catch(err) {
        result.status=422
        result.errStack = err
        result.msg = errorsMsgs.errorHandling(err.message)
        if (typeof callback == 'function') callback(result)
    }
}

//#region - Especificação
    // Quando o usuário é criado pelo Owner do Sistema, utilizando a interface de criação de usuário no client,
    // ou após o cliente ter confirmado seu cadastro pelo e-mail, quando o mesmo realiza o cadastro de seu próprio
    // usuário, o client passa a utlizar este método para execução do login.
//#endregion
exports.login = (user,callback) => {
    let result = jsonResponse()
    try {
        applyRules(knex,result,user,'login')
        .then((result) => {
            
            let field = user.email.trim().length > 0 ? 'email' : 'logonUser'
            let fieldValue = user.email.trim().length > 0 ? user.email : user.logonUser 

            knex('user').where(field,fieldValue)
                .then((registers)=> {
                    result.status = 200
                    if (registers.length >0) {
                         
                        //Verifica se o Usuário foi desativado
                        if (registers[0].activated === 0)  {
                            result.status = 403
                            result.msg= msgs.userNotActivated
                            if (typeof callback == 'function') callback(result)
                        }

                        let password = crypto.decrypt(registers[0].password)
                        //Verifica se a senha informada é igual a gravada no banco de dados.
                        if (password === user.password) {

                            //JWT - Json Web Token.
                            let  identification = registers[0].id
                            let  token = jwt.sign({id:identification,email:user.email},secret,{expiresIn: TOKEN_EXP})

                            //#region  
                            knex('user').where(field,fieldValue).update({ status: true,lastLogin: new Date()})
                                .then(()=> {
                                    knex('permission').join('route','permission.route_id','route.id')
                                    .where('profile_id',registers[0].profile_id)
                                    .select('route.route','permission.profile_id','permission.write','permission.read','permission.delete')
                                    .then((permissions)=> {
                                        if (permissions.length > 0) {
                                            result.status=200   
                                            result.msg = msgs.successedLogin 
                                            result.registers = registers
                                            result.permission = permissions
                                            result.token = token 
                                            result.auth = true
                                        }else {
                                            result.msg = msgs.PermissionNotDefined
                                            result.status=404
                                        }
                                       
                                        operational_log.log('login',result,user)
                                        if (typeof callback == 'function') callback(result)
                                    })
                                    .catch((err)=> {
                                        result.errStack = err
                                        result.msg = db_errors.errorHandling(err)
                                        result.status=422  
                                        if (typeof callback == 'function') callback(result)  
                                    })
                                })
                                .catch((err)=> {
                                    result.errStack = err
                                    result.msg = db_errors.errorHandling(err)
                                    result.status=422   
                                    if (typeof callback == 'function') callback(result)           
                                })
                            //#endregion
                        } 
                        else {
                            result.status = 422
                            result.msg= msgs.passwordIncorrect
                            if (typeof callback == 'function') callback(result)
                        }
                    }else {
                        result.status = 422
                        result.msg= msgs.UserNotFound
                        if (typeof callback == 'function') callback(result)
                    }
                    
                })
                .catch((err) => {
                    result.errStack = err
                    result.msg = db_errors.errorHandling(err)
                    result.status=422
                    if (typeof callback == 'function') callback(result)
                })
        })
        .catch(()=> {
            result.status=200
            if (typeof callback == 'function') callback(result)
        })
    } 
    catch(err) {
        result.status=422
        result.errStack = err
        result.msg = errorsMsgs.errorHandling(err.message)
        if (typeof callback == 'function') callback(result)
    }
}

//#region - Especificação
    //Recuperação de senha utilizado apenas para usuários que realização a criação de sua própria conta.
    //Quando usuário cadastrado pelo owner do sistema através da interface de criação de usuário no client,
    //esta não é utilizada. Ao esquecer a senha o mesmo deverá acionar o comando troca de senha.
//#endregion
exports.recoveryPass = (user,callback) => {
    let result = jsonResponse()
    try {
        applyRules(knex,result,user,'recoveryPass')
        .then((result) => {
            
            knex('user').where('email',user.email).andWhere('cpf',user.cpf).andWhere('status',1)
                .then((registers)=> {
                    if (registers.length >0) {
                            result.status = 200
                            
                            let  identification = registers[0].id
                            let  token = jwt.sign({id:identification,email:user.email},secret, { expiresIn: TOKEN_EXP })    
                            let cpfCripto =  crypto.encrypt(user.cpf)

                            let mensagem = `Clique no link e realize a troca da sua senha - http://${envVar.envWebAppHost}/changePassword/${token}/${cpfCripto}` 
                            sendMail(user.email,user.name, mensagem)
                            .then((success)=> {
                                result.msg = msgs.tokenChangePassword
                                result = success
                            })
                            .catch((error)=> {
                                result = error
                                operational_log.log('emailRecoveryPass',result,user)
                            })
                            .finally(() => { 
                                if (typeof callback == 'function') callback(result)
                            })

                    } 
                    else {
                        result.status = 422
                        result.msg= msgs.UserNotFound
                        if (typeof callback == 'function') callback(result)
                    }
                    
                })
                .catch((err) => {
                    result.errStack = err
                    result.msg = db_errors.errorHandling(err)
                    result.status=422
                    if (typeof callback == 'function') callback(result)
                })
        })
        .catch(()=> {
            result.status=200
            if (typeof callback == 'function') callback(result)
        })
    } 
    catch(err) {
        result.status=422
        result.errStack = err
        result.msg = errorsMsgs.errorHandling(err.message)
        if (typeof callback == 'function') callback(result)
    }
}

//#region - Especificação
    // Permite que o usuário possa realizar a troca de senha.
    //No caso dos usuários que criam sua própria conta, o mesmo ao  solicitar  que a senha seja recuperada,
    //recebe um email com um token contento a url que direciona o mesmo para a troca de senha, mais um token
    //para validação de usuário contendo o id do mesmo e o cpf que serão validados no momento da troca da senha.
//#endregion
exports.changePassword = (key,cpf,user,callback) => {
    let result = jsonResponse()
    try {

        let payload = jwt.verify(key,secret)

        applyRules(knex,result,user,'changePass')
        .then((result) => {
            knex('user').where('id',payload.id).andWhere('email',payload.email)
                .then((registers)=> {
                    result.status = 200
                    if (registers.length >0) {
                            let password = crypto.encrypt(user.password)
                            knex('user').where('id',payload.id).andWhere('email',payload.email).update({ password: password,status: true})
                                .then(()=> {
                                    result.msg = msgs.passwordChanged
                                })
                                .catch((err)=> {
                                    result.errStack = err
                                    result.msg = db_errors.errorHandling(err)
                                    result.status=422    
                                })
                                .finally(()=> {
                                    if (typeof callback == 'function') callback(result)   
                                })
                    } 
                    else {
                        result.status = 422
                        result.msg= msgs.UserNotFound
                        if (typeof callback == 'function') callback(result)
                    }
                    
                })
                .catch((err) => {
                    result.errStack = err
                    result.msg = db_errors.errorHandling(err)
                    result.status=422
                    if (typeof callback == 'function') callback(result)
                })
        })
        .catch(()=> {
            result.status=200
            if (typeof callback == 'function') callback(result)
        })
    } 
    catch(err) {
        result.status=422
        result.errStack = err
        result.msg = errorsMsgs.errorHandling(err.message)
        if (typeof callback == 'function') callback(result)
    }
}

//#region - Especificação
    //Quando o sistema esta configurado para possibilitar que a criação dos usuários sejam realizadas 
    //pelo próprio administrador, este além de realizar o cadastro fornecendo as informações 
    //do usuário, deverá enviar uma senha inicial ao usuário. Ao receber esta senha, o usuário 
    //será direcionado para a tela de troca de senha. A flag resetPassword é acionada sempre que um 
    //novo cadastro é realizado ou sempre que o administrador acioná=la.
//#endregion
exports.changePasswordUserByAdmin = (id,user,callback) => {
    let result = jsonResponse()
    try {
        applyRules(knex,result,user,'changePass')
        .then((result) => {
            knex('user').where('id',id)
                .then((registers)=> {
                    result.status = 200
                    if (registers.length >0) {
                            let password = crypto.encrypt(user.password)
                            knex('user').where('id',id).update({ password: password,status: true,restartPassword:false})
                                .then(()=> {
                                    result.msg = msgs.passwordChanged
                                })
                                .catch((err)=> {
                                    result.errStack = err
                                    result.msg = db_errors.errorHandling(err)
                                    result.status=422    
                                })
                                .finally(()=> {
                                    if (typeof callback == 'function') callback(result)   
                                })
                    } 
                    else {
                        result.status = 422
                        result.msg= msgs.UserNotFound
                        if (typeof callback == 'function') callback(result)
                    }
                    
                })
                .catch((err) => {
                    result.errStack = err
                    result.msg = db_errors.errorHandling(err)
                    result.status=422
                    if (typeof callback == 'function') callback(result)
                })
        })
        .catch(()=> {
            result.status=200
            if (typeof callback == 'function') callback(result)
        })
    } 
    catch(err) {
        result.status=422
        result.errStack = err
        result.msg = errorsMsgs.errorHandling(err.message)
        if (typeof callback == 'function') callback(result)
    }
}

//#region - Especificação
    //Registra dados de logout do usuário.
//#endregion
exports.logout = (user,callback) => {
    let result = jsonResponse()
    try {
            knex('user').where('email',user.email).andWhere('status',1)
                .then((registers)=> {
                    result.status = 200
                    if (registers.length >0) {
                            knex('user').update({ status: true,lastLogout: new Date()})
                                .then(()=> {
                                    result.bsApproved = true
                                    result.msg = msgs.successedLogout 
                                })
                                .catch((err)=> {
                                    result.errStack = err
                                    result.msg = db_errors.errorHandling(err)
                                    result.status=422            
                                })
                                .finally(()=> {
                                    operational_log.log('logout',result,user)
                                    if (typeof callback == 'function') callback(result)
                                })
                    } 
                    else {
                        result.status = 422
                        result.msg= msgs.UserNotFound
                        if (typeof callback == 'function') callback(result)
                    }
                })
                .catch((err) => {
                    result.status=422
                    result.errStack = err
                    result.msg = db_errors.errorHandling(err)
                    if (typeof callback == 'function') callback(result)
                })
     } 
    catch(err) {
        result.status=422
        result.errStack = err
        result.msg = errorsMsgs.errorHandling(err.message)
        if (typeof callback == 'function') callback(result)
    }
}

    



