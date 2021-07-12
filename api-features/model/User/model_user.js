const msgs = require('../../commons/allMessages')
const knex = require('../../database/connection')
const db_errors = require('../../commons/db_errors')
const errorsMsgs = require('../../commons/errorsMsgs')
const operational_log = require('../../commons/operational_log')
const applyRules = require('./bs_user')
const crypto = require('../../commons/cripto')
const jsonResponse = require('../../commons/DialogReactAndApi')
const sendMail = require('../../commons/nodemail')
const jwt = require('jsonwebtoken')
const secret = require('../../config/secret')
const configParameter = require('../ConfigParameter/model_configParameter')
const envVar = require('../../config/envConfig')

exports.addUser = (user,callback) => {
    let result = jsonResponse()
    try {
            
        if (user.password) {
            user.password = crypto.encrypt(user.password)
        }
                
        configParameter.getConfigParameter({parameter:'createUsersByAdmin'}, (result) => {
            let createUsersByAdmin = result.registers.length > 0 ? result.registers[0].parameterValue : 0

            applyRules(knex,result,user,'add')
            .then(() => {
                knex('user').insert(user)
                    .then((userId) => {

                        //JWT - Json Web Token.
                        let  identification = userId[0]
                        let  token = jwt.sign({id:identification,email:user.email},secret)

                        if (!user.status) {

                            if (parseInt(createUsersByAdmin) !== 1) { 
                                let mensagem = `Seu cadastro foi realizado Pelo adiministrador do Sistema, É necessário realizar o cadastro de uma nova senha para que vocÊ tenha acesso. - http://${envVar.envHost}:${envVar.envPort}/changePassword/${token}/${identification}` 
                        
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
                                    operational_log.log('addUser',result,user)
                                    if (typeof callback == 'function') callback(result)
                                })

                            } else {
                                result.status=201
                                result.msg = msgs.ad_msg
                                operational_log.log('addUser',result,user)
                                if (typeof callback == 'function') callback(result)
                            }
                        }else {
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
            .catch((result) => {
                    result.bsApproved=false 
                    result.status=200
                    if (typeof callback == 'function') callback(result)
            })
        })
    }
    catch(err) {
        result.status=422
        result.errStack = err
        errorsMsgs.errorHandling(err.message)
        if (typeof callback == 'function') callback(result)
    }
}

exports.updateUser = (user,callback) => {
    let result = jsonResponse()
    try { 
        if (user.password !== null) {
            user.password = crypto.encrypt(user.password)
        }
        applyRules(knex,result,user,'update')
        .then(() => {
            knex('user').where('id',user.id).update(user)
                .then((wasUpdated) => {
                    if (wasUpdated >0) { 
                    result.msg = msgs.up_msg 
                        result.status=200
                    } else { 
                        result.msg = msgs.not_up_msg
                        result.status=422    
                    }
                })
                .catch((err) => {
                    result.errStack = err
                    result.msg = db_errors.errorHandling(err)
                    result.status=422
                })
                .finally(() => { 
                    operational_log.log('updateUser',result,user)
                    if (typeof callback == 'function') callback(result)
                })
            })
            .catch((result) => {
                result.bsApproved=false 
               result.status=200
               if (typeof callback == 'function') callback(result)
            })
        }
    catch(err) {
        result.status=422
        result.errStack = err
        errorsMsgs.errorHandling(err.message)
        if (typeof callback == 'function') callback(result)
    }
}

exports.deleteUser = (id,callback) => {
    let result = jsonResponse()
    try {
        knex('user').where('id',id)
            .then((element) => { 
                if (element.length > 0) {
                    knex('user').where('id',id).delete()
                    .then(() => {
                        result.msg = msgs.de_msg 
                        result.status=200
                    })    
                    .catch((err) => {
                        result.errStack = err
                        result.msg = db_errors.errorHandling(err)
                        result.status=422
                    })
                    .finally(() => { 
                        operational_log.log('deleteUser',result,id)
                        if (typeof callback == 'function') callback(result)
                    })
                }else {
                    result.msg = msgs.registerNotFound
                    result.status=404
                    if (typeof callback == 'function') callback(result)
                }
            })
            .catch(() => {
                result.status=404
                result.msg = msgs.registerNotFound
                if (typeof callback == 'function') callback(result)
            })
            
    }
    catch(err) {
        result.status=422
        result.errStack = err
        errorsMsgs.errorHandling(err.message)
        if (typeof callback == 'function') callback(result)
    }
}

exports.editUser = (id,callback) => {
    let result = jsonResponse()    
    try { 
        knex('user').where('id',id)
            .then((element) => { 
                if (element.length > 0) {

                    if (element[0].password !== null) {
                        element[0].password = crypto.decrypt(element[0].password)
                    }

                    result.msg = msgs.ed_msg 
                    result.registers = element
                    result.status=200
                }else {
                    result.msg = msgs.registerNotFound
                    result.status=404
                }
            })
            .catch((err) => {
                result.status=422
                result.errStack = err
                result.msg = db_errors.errorHandling(err)
            })
            .finally(() => { 
                operational_log.log('editUser',result,id)
                if (typeof callback == 'function') callback(result)
            })
    }
    catch(err) {
        result.status=422
        result.errStack = err
        errorsMsgs.errorHandling(err.message)
        if (typeof callback == 'function') callback(result)
    }
}

exports.allUser = (callback) => {
    let result = jsonResponse()
    try {
        knex('user').innerJoin('profile','user.profile_id','profile.id').select('user.id','user.name','user.logonUser','user.email','profile.name AS profileName','user.rfid').where('profileNumber','>',0).orderBy('name')
            .then( (registers) => {
                if (registers.length > 0) {
                    result.msg = registers.length + msgs.al_msg
                    result.registers = registers
                    result.status=200
                }
                else {
                    result.msg = msgs.registerNotFound
                    result.status=200
                }
            })
            .catch((err) => {
                result.status=422
                result.errStack = err
                result.msg = db_errors.errorHandling(err)
            })
            .finally(() => { 
                operational_log.log('allUser',result)
                if (typeof callback == 'function') callback(result)
            })
    }
    catch(err) {
        result.status=422
        result.errStack = err
        errorsMsgs.errorHandling(err.message)
        if (typeof callback == 'function') callback(result)
    }
}

exports.reportUser = (filter,callback) => {
    let result = jsonResponse()
    try { 
        let whereClause=''
        if (filter.value != '') { 
            whereClause = "where " + filter.field + " like '%" + filter.value + "%'"
        }
                
        knex.raw('Select * from user ' + whereClause)
            .then( (registers) => {
                if (registers[0].length > 0) {
                    result.msg = registers[0].length + msgs.al_msg
                    result.registers = registers[0]
                    result.status=200
                }
                else {
                    result.msg = msgs.registerNotFound
                    result.status=404 
                }
            })
            .catch((err) => {
                result.status=422
                result.errStack = err
                result.msg = db_errors.errorHandling(err)
            })
            .finally(() => { 
                operational_log.log('reportUser',result)
                if (typeof callback == 'function') callback(result)
            })
    }
    catch(err) {
        result.status=422
        result.errStack = err
        errorsMsgs.errorHandling(err.message)
        if (typeof callback == 'function') callback(result)
    }
   
}









         



