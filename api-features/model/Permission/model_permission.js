const msgs = require('../../commons/allMessages')
const knex = require('../../database/connection')
const db_errors = require('../../commons/db_errors')
const errorsMsgs = require('../../commons/errorsMsgs')
const operational_log = require('../../commons/operational_log')
const jsonResponse = require('../../commons/DialogReactAndApi')

exports.addPermission = (permission,callback) => {
let result = jsonResponse()
    try {
    knex('permission').insert(permission)
        .then(() => {
            result.msg = msgs.ad_msg
            result.status=201
            operational_log.log('addPermission',result,permission)
        })    
        .catch((err) => {
            result.errStack = err
            result.msg = db_errors.errorHandling(err)
            result.status=422
        })
        .finally(() => { 
            operational_log.log('addPermission',result,permission)
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

exports.updatePermission = (permission,callback) => {
    let result = jsonResponse()
    try { 
        knex('permission').where('id',permission.id).update(permission)
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
                operational_log.log('updatePermission',result,permission)
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

exports.deletePermission = (id,callback) => {
    let result = jsonResponse()
    try {
        knex('permission').where('id',id)
            .then((element) => { 
                if (element.length > 0) {
                    knex('Permission').where('id',id).delete()
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
                        operational_log.log('deletePermission',result,id)
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

exports.editPermission = (id,callback) => {
    let result = jsonResponse()    
    try { 
        knex('permission').where('id',id)
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
                operational_log.log('editPermission',result,id)
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

exports.allPermission = (callback) => {
    let result = jsonResponse()
    try {
            knex('permission').join('profile','permission.profile_id','profile.id')
                               .join('route','permission.route_id','route.id')
                               .select('permission.id','permission.profile_id','permission.route_id',
                               'profile.name','route.description','route.route','permission.read',
                               'permission.write','permission.delete','route.internal').where('profile.profileNumber','>',0)
                               .orderBy([{ column: 'profile.name' },{ column: 'route.description'}])
            .then( (registers) => {
                if (registers.length > 0) {
                    result.msg = registers.length + msgs.al_msg
                    result.registers = registers
                    result.status=200
                } else {
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
                operational_log.log('allPermission',result)
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

exports.getPermissionByProfile = (permission,callback) => {
    let result = jsonResponse()
    try {
            knex('permission').where('permission.profile_id',permission.profile_id)
                               .join('profile','permission.profile_id','profile.id')
                               .join('route','permission.route_id','route.id')
                               .select('permission.id','permission.profile_id','permission.route_id',
                               'profile.name','route.description','route.route','permission.read',
                               'permission.write','permission.delete','route.internal')
                               .orderBy([{ column: 'profile.name' },{ column: 'route.description'}])
            .then( (registers) => {
                if (registers.length > 0) {
                    result.msg = registers.length + msgs.al_msg
                    result.registers = registers
                    result.status=200
                } else {
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
                operational_log.log('getPermissionByProfile',result)
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

exports.reportPermission = (filter,callback) => {
    let result = jsonResponse()
    try { 
        let whereClause=''
        if (filter.value != '') { 
            whereClause = "where " + filter.field + " like '%" + filter.value + "%'"
        }
                
        knex.raw('Select * from permission ' + whereClause)
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
                operational_log.log('reportPermission',result)
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







         



