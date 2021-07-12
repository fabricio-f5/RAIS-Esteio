const msgs = require('../../commons/allMessages')
const knex = require('../../database/connection')
const db_errors = require('../../commons/db_errors')
const errorsMsgs = require('../../commons/errorsMsgs')
const operational_log = require('../../commons/operational_log')
const applyRules = require('./bs_avaliableKey')
const jsonResponse = require('../../commons/DialogReactAndApi')
const rfidObj = require('./rfid.js')
const mailControl = require('./mail')
const configParameter = require('../ConfigParameter/model_configParameter')
const keyHolder  = require('../KeyHolder/model_keyHolder')


//Adiciona Chaves a um determinado Claviculário.
exports.addAvaliableKey = (avaliableKey,callback) => {
let result = jsonResponse()
    try {
                applyRules(knex,result,avaliableKey,'add')
                .then(() => {
                    knex('avaliablekey').insert(avaliableKey)
                        .then(() => {
                            result.msg = msgs.ad_msg
                            result.status=201
                            operational_log.log('addAvaliableKey',result,avaliableKey)
                        })    
                        .catch((err) => {
                            result.errStack = err
                            result.msg = db_errors.errorHandling(err)
                            result.status=422
                        })
                        .finally(() => { 
                            operational_log.log('addAvaliableKey',result,avaliableKey)
                            if (typeof callback == 'function') callback(result)
                        })
                })
                .catch((result) => {
                    result.status=200
                    result.bsApproved=false
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

//Adicionar um Range ou Grupo de Chave sequencial à um determinado Claviculário.
exports.addGroupOfAvaliableKey = (keyHolder,callback) => {
    let result = jsonResponse()
    let avaliableKey = new Array()
        try {

            for (let i=1; i <= keyHolder.qtdeKeys;i++) { 
                avaliableKey.push({keyHolder_id: keyHolder.keyHolder_id,number:i})
            }
            knex('avaliablekey').delete('*').where('keyHolder_id',keyHolder.keyHolder_id)
            .then(() => {
                        knex('avaliablekey').returning('*').insert(avaliableKey)
                        .then(() => {
                            result.msg = msgs.ad_msg
                            result.status=201
                            operational_log.log('addGroupOfAvaliableKey',result,avaliableKey)
                        })    
                        .catch((err) => {
                            result.errStack = err
                            result.msg = db_errors.errorHandling(err)
                            result.status=422
                        })
                        .finally(() => { 
                            operational_log.log('addGroupOfAvaliableKey',result,avaliableKey)
                            if (typeof callback == 'function') callback(result)
                        })
            })
            .catch((err) => {
                result.errStack = err
                result.msg = db_errors.errorHandling(err)
                result.status=422
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

//Atualiza informações de uma Determinada Chave.
    exports.updateAvaliableKey = (avaliableKey,callback) => {
    let result = jsonResponse()
    
    //Convert Data to Entity
    let _avaliableKey = {keyHolder_id:avaliableKey.keyHolder_id,
                         profile_id: !avaliableKey.profile_id ? null : avaliableKey.profile_id,
                         number:avaliableKey.number,
                         situation:avaliableKey.situation,
                         description:avaliableKey.description,
                         sealNumber: avaliableKey.sealNumber}
  
    try { 
        applyRules(knex,result,avaliableKey,'update')
        .then(() => {
            knex('avaliablekey')
            .update(_avaliableKey)
            .where('id',avaliableKey.id)
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
                    operational_log.log('updateAvaliableKey',result,avaliableKey)
                    if (typeof callback == 'function') callback(result)
                })
            })
        .catch((result) => {
            result.status=200
            result.bsApproved = false 
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

//Excluí uma Chave do Claviculário.
exports.deleteAvaliableKey = (id,callback) => {
    let result = jsonResponse()
    try {
        knex('avaliablekey').where('id',id)
            .then((element) => { 
                if (element.length > 0) {
                    knex('avaliablekey').where('id',id).delete()
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
                        operational_log.log('deleteAvaliableKey',result,id)
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

//Excluí todas as Chaves do Claviculário.
exports.deleteAllAvaliableKey = (callback) => {
    let result = jsonResponse()
    try {
        knex('avaliablekey').delete()
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
            operational_log.log('deleteAllAvaliableKey',result)
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

//Edit informações de uma Chave de umclaviculário.
exports.editAvaliableKey = (id,callback) => {
    let result = jsonResponse()    
    try { 
        knex('avaliablekey').where('id',id)
            .then((element) => { 
                if (element.length > 0) {
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
                operational_log.log('editAvaliableKey',result,id)
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

//Retorna uma Chave atráves do Número.
exports.getAvaliableKey = (number,callback) => {
    let result = jsonResponse()    
    try { 
        knex('avaliablekey').where('number',number)
        .leftJoin('profile','profile.id','avaliablekey.profile_id')
        .innerJoin('keyholder','keyholder.id','avaliablekey.keyHolder_id')
        .select('avaliablekey.id','avaliablekey.keyHolder_id',
                'keyholder.identification','avaliablekey.number','avaliablekey.profile_id',
                'profile.description AS profileDescription',
                'avaliablekey.description','avaliablekey.situation','avaliablekey.user','avaliablekey.sealNumber')
            .then((element) => { 
                if (element.length > 0) {
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
                operational_log.log('editAvaliableKey',result,number)
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

//Retorna todas as chaves do Claviculário.
exports.allAvaliableKey = (callback) => {
    let result = jsonResponse()
    try {
        knex('avaliablekey')
        .leftJoin('profile','profile.id','avaliablekey.profile_id')
        .innerJoin('keyholder','keyholder.id','avaliablekey.keyHolder_id')
        .select('avaliablekey.id','avaliablekey.keyHolder_id',
                'keyholder.identification','avaliablekey.number','avaliablekey.profile_id',
                'profile.description AS profileDescription',
                'avaliablekey.description','avaliablekey.situation','avaliablekey.user','avaliablekey.sealNumber')
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
                operational_log.log('allAvaliableKey',result)
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

//Retorna todas as Chaves de um claviculário especifico.
exports.getAvaliableKeyByKeyHolder = (keyHolder,callback) => {
    let result = jsonResponse()
    try {
        knex('avaliablekey')
        .leftJoin('profile','profile.id','avaliablekey.profile_id')
        .innerJoin('keyholder','keyholder.id','avaliablekey.keyHolder_id')
        .select('avaliablekey.id','avaliablekey.keyHolder_id',
                'keyholder.identification','avaliablekey.number','avaliablekey.profile_id',
                'profile.description AS profileDescription',
                'avaliablekey.description','avaliablekey.situation','avaliablekey.user','avaliablekey.sealNumber','avaliablekey.exception')
        .where('avaliablekey.keyHolder_id',keyHolder.id)
        
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
                operational_log.log('getAvaliableKeyByKeyHolder',result)
            })
            .finally(() => { 
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

//Permite a busca de chaves conforme filtro específico.
exports.reportAvaliableKey = (filter,callback) => {
    let result = jsonResponse()
    try { 
        let whereClause=''
        if (filter.value != '') { 
            whereClause = "where " + filter.field + " like '%" + filter.value + "%'"
        }
                
        knex.raw('Select * from avaliablekey ' + whereClause)
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
                operational_log.log('reportAvaliableKey',result)
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

//Limpa a área de memória global que armazena o RFID. Utilizado na lógica de associação de RFID com User.
exports.clearRFID = (callback) => {
    let result = jsonResponse()
    try {
        rfidObj.rfid = ''
        result.status=200
        result.msg = msgs.PurgedRFIDinMemory
    }
    catch(err) {
        result.status=422
        result.errStack = err
    }

    operational_log.log('clearRFID',result)
    if (typeof callback == 'function') callback(result)

}

//Busca o RFID da memória global.
exports.getRFID = (callback) => {
    let result = jsonResponse()
    try {
        result.status=200
        if (rfidObj.rfid) { 
            result.registers = {rfid:rfidObj.rfid}
            result.msg = `RFID ${rfidObj.rfid} lido da memória`
        }else {
            result.msg = msgs.noRFIDinMemory
        }
        operational_log.log('getRFID',result)
        if (typeof callback == 'function') callback(result)
    }
    catch(err) {
        result.status=422
        result.errStack = err
        errorsMsgs.errorHandling(err.message)
        if (typeof callback == 'function') callback(result)
    }
}

//Verifica se existe alguma chave qua não pertence ao perfil do usuário.
exports.checkForKeyNotPermited = (removedKeys,keyHolderNumber,user) =>  {
   
    return new Promise((resolve) => { 
        let result = jsonResponse()
        try {
                let rmKeys = removedKeys.keys.filter((e)=> e.status === 0).map((e)=> {
                    return e.number
                })

                knex('keyholder').select('id').where('number',keyHolderNumber)
                .then((keyholderItens)=> {
                    if (keyholderItens.length > 0) { 
                            knex('avaliablekey').innerJoin('profile','avaliablekey.profile_id','profile.id')
                                                .innerJoin('keyholder','avaliablekey.keyHolder_id','keyholder.id')                       
                            .where('avaliablekey.keyHolder_id',keyholderItens[0].id)
                            .whereIn('avaliablekey.number',rmKeys)
                            .where('profile.accessLevel','<',user.accessLevel)
                            .select('avaliablekey.*')
                            .then((notAuthKeyItens)=> {
                                if (notAuthKeyItens.length > 0) { 
                                    result.msg = 'Enviar e-mail e gerar registro no relatório de chaves retiradas fora do perfil'
                                    result.registers = notAuthKeyItens
                                } else { 
                                    result.msg = 'Todas as chaves pertencem ao perfil do usuário.'
                                }
                            })
                            .catch((e)=> {
                                result.errStack = e 
                            })
                            .finally(()=> {
                                operational_log.log('checkForKeyNotPermited',result)
                                resolve(result)
                            })
                    } else {
                        result.msg = msgs.keyHolderNotFound
                        operational_log.log('checkForKeyNotPermited',result)
                        resolve(result)
                    }
                })
                .catch((e)=> { 
                    result.errStack = e 
                    operational_log.log('checkForKeyNotPermited',result)
                    resolve(result)
                })
        }
        catch(e) { 
            result.errStack = e 
            operational_log.log('checkForKeyNotPermited',result)
            resolve(result)
        }
    })

}

//Verifica se existe RFID associado a algum usuário.
exports.VerifyRFIDAssociated = (rfid,callback) => {
    let result = jsonResponse()
        try {
            knex('user')
            .innerJoin('profile','profile.id','user.profile_id')
            .select('user.*','profile.profileNumber','profile.accessLevel').where('rfid',rfid)
            .then((regs) => {
                result.status=200
                if (regs.length > 0) { 
                    result.msg = `Usuário ID:${regs[0].id} - associado ao RFID ${rfid}`
                    result.registers = regs
                } else { 
                   rfidObj.rfid = rfid
                   result.msg = msgs.userNotAssociatedWithRfid
                }
            })    
            .catch((err) => {
                result.errStack = err
                result.msg = db_errors.errorHandling(err)
                result.status=422
            })
            .finally(() => { 
                operational_log.log('VerifyRFIDAssociated',result,rfid)
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

//Verifica quais chaves foram retiradas, sem permissão conforme perfil de acesso.
const sendMailToSupervisor =  (exceptionAccess,user,keyHolderNumber)=>  {

    let result = jsonResponse()
    let keys = ''
    for(let i=0; i <= exceptionAccess.length-1; i++) {
        keys = keys + `[${exceptionAccess[i].keyNumber}] `
    }
    
    keyHolder.getKeyHolderByNumber(keyHolderNumber,(keyHolderResult)=> {
        if (keyHolderResult.registers.length > 0) { 
                let keyHolder =  keyHolderResult.registers.shift()  
                configParameter.getConfigParameter({parameter:"SupervisorEmail"}, (configParamenterResult)=> {
                if (configParamenterResult.registers.length > 0) { 
                        let configParameter =  configParamenterResult.registers.shift()  
                        mailControl(configParameter.parameterValue,
                                    user,keys,keyHolder.identification)
                                    .then(()=> { 
                                        result.msg = `Email enviado com sucesso.`
                                        operational_log.log('envio de Email',result)
                                        console.log(result.msg)
                                    })
                                    .catch((error)=> {
                                        result.msg = `Erro ao enviar e-mail.`
                                        result.errStack = error
                                        operational_log.log('envio de Email',result)
                                        console.log(result.msg)
                                        console.log(error)
                                    })
                
                }else {console.log('Parâmentro - [SupervisorEmail] não encontrado.')}
            })
        }else {console.log(`Claviculário de número .${keyHolderNumber} não encontrado.`)}        
    })
}

//Atualiza a situação das chaves de um determinado Claviculário.
exports.UpdateKeys = (keyHolderNumber,rfid,keyMapping,callback) => {
    let result = jsonResponse()
        try {
            result.status =200
            this.VerifyRFIDAssociated(rfid,(obj) => { 
                if (obj.registers.length > 0) { 
                    this.checkForKeyNotPermited(keyMapping,keyHolderNumber,obj.registers[0])
                    .then((notAuthKeyItens)=> { 
                        let notAuthKey = notAuthKeyItens.registers.length > 0 ? notAuthKeyItens.registers : null
                        const queries = []
                        const exceptionAccess =[]

                        let userWhenGetTheKey = ''
                        let user = obj.registers[0].logonUser 
                        
                        if (keyMapping.keys.length > 0) {
                            knex.transaction(trx=> {
                                    keyMapping.keys.forEach(e => {
                                        
                                        userWhenGetTheKey = e.status === 0 ? obj.registers[0].logonUser : null

                                        const reportRegister = { 
                                            userLogon: user,
                                            name: obj.registers[0].name,
                                            keyHolder: keyHolderNumber,
                                            keyNumber: e.number,
                                            status: e.status,
                                            exception:  notAuthKey ? 
                                                            notAuthKey.filter((key)=> key.number === e.number).length > 0 ? 1 : 0
                                                        : 0
                                        }    

                                        //Se o usuário que pegou a chave, não tem permissão, será marcado na chava como exception
                                        //até que este usuário a devolva.
                                        if (e.status === 0)  {
                                            e.exception =  notAuthKey ? 
                                                                notAuthKey.filter((key)=> key.number === e.number).length > 0 ? 1 : 0
                                                            : 0
                                        }
                                        else {
                                            e.exception = 0
                                        }
                                        
                                        const query = knex('avaliablekey')
                                                        .innerJoin('keyholder','keyholder.id','avaliablekey.keyholder_id')
                                                        .where('keyholder.number',keyHolderNumber).where('avaliablekey.number',e.number)
                                                        .update({situation: e.status,user: userWhenGetTheKey,exception: e.exception})                       
                                                        .transacting(trx)
                                        const queryReport = knex('reportkeyholderhistory').insert(reportRegister).transacting(trx)
                                        queries.push(query)
                                        queries.push(queryReport)

                                        //Usuário retirou uma chave sem possuir o devido acesso.
                                        reportRegister.status === 0 && reportRegister.exception === 1 ? exceptionAccess.push(reportRegister) : null

                                        
                                    })

                                    Promise.all(queries).then(()=> {
                                        trx.commit()
                                        result.msg = msgs.statusKeyUpdated
                                        exceptionAccess.length >0 ? sendMailToSupervisor(exceptionAccess,user,keyHolderNumber) : null
                                    })
                                    .catch((e)=> {
                                        trx.rollback()
                                        result.status=422
                                        result.msg = msgs.statusKeyUpdatedNotOk
                                        result.errStack = e
                                    })
                                    .finally(()=> {
                                        operational_log.log('UpdateKeys',result,keyMapping)
                                        if (typeof callback == 'function') callback(result)
                                    })
                            })
                        }
                        else {
                            knex('reportkeyholderhistory')
                            .insert({userLogon: user, 
                                     name: obj.registers[0].name,
                                     keyHolder:keyHolderNumber,
                                     keyNumber:null,
                                     status:null,exception:null})
                            .then(()=> {
                                result.msg = 'Usuário abriu e fechou o claviculário sem devolver ou retirar chaves.'
                                console.log(result.msg)
                                operational_log.log('UpdateKeys',result)   
                            })
                            .catch((e)=> {
                                result.msg = 'Sistema tentou registrar abertura e fechamento do claviculário sem retirada ou devolução de chave.'
                                result.errStack = e
                                console.log(result.msg)
                            })
                            .finally(()=> {
                                rfidObj.rfid = rfid
                                result.registers = []
                                operational_log.log('UpdateKeys',result)
                                if (typeof callback == 'function') callback(result)
                            })    
                        }    
                    })
                }
                else { 
                    result = obj  
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

//Associa usuário ao RFID posicionado na áreal global.
exports.AssociateUserAndRFID = (userId,callback) => {
    let result = jsonResponse()
    try {
        if (rfidObj.rfid)  {
            knex('user').update({rfid: rfidObj.rfid}).where('id',userId)
            .then((wasUpdated) => {
                result.status=200
                if (wasUpdated) { 
                    result.msg = msgs.RFIDAssociated
                    rfidObj.rfid = ''
                } else { 
                   result.msg = msgs.notUpdatedRFID
                   result.bsApproved = false
                }
            })    
            .catch((err) => {
                result.errStack = err
                result.msg = db_errors.errorHandling(err)
                result.status=422
            })
            .finally(() => { 
                operational_log.log('AssociateUserAndRFID',result)
                if (typeof callback == 'function') callback(result)
            })
        }
        else {
            result.status=404
            result.msg = msgs.noRFIDinMemory
            operational_log.log('AssociateUserAndRFID',result)
            if (typeof callback == 'function') callback(result)
        }
        
    }
    catch(err) {
        result.status=422
        result.errStack = err
        errorsMsgs.errorHandling(err.message)
        if (typeof callback == 'function') callback(result)
    }
   
}


         



