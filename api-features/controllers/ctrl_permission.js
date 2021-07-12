const model = require('../model/Permission/model_permission')
const msgs = require('../commons/allMessages')


exports.addPermission = (req,res) => {
    if (req.body) {
        model.addPermission(req.body, function(obj) {
            res.status(obj.status).send(obj)})
    }else {
        res.status(400).send({msg: msgs.emptyBody})  
    } 
}

exports.deletePermission = (req,res) => {
    if (req.body.id) {
        model.deletePermission(req.body.id, function(obj) {
                res.status(obj.status).send(obj)})
    }else {
        res.status(400).send({msg: msgs.emptyBody})  
    } 
}

exports.editPermission = (req,res) => {
    if (req.params.id) {
        model.editPermission(req.params.id, function(obj) {
            res.status(obj.status).send(obj)
        })
    }else {
        res.status(400).send({msg: msgs.emptyBody})        
    } 
}

exports.allPermission = (req,res) => {

    if (req.body) {
        model.allPermission(function(obj) {
            res.status(obj.status).send(obj)
        })
    }else {
        res.status(400).send({msg: msgs.emptyBody})  
    } 

}

exports.reportPermission = (req,res) => {

    if (req.body) {
        model.reportPermission(req.body, function(obj) {
            res.status(obj.status).send(obj)
        })
    }else {
        res.status(400).send({msg: msgs.emptyBody})  
    } 

}

exports.updatePermission = (req,res) => {
    if (req.body) {
        model.updatePermission(req.body, function(obj) {
            res.status(obj.status).send(obj)
        })
    }else {
        res.status(400).send({msg: msgs.emptyBody})  
    } 

}

exports.getPermissionByProfile = (req,res) => {

    if (req.body) {
        model.getPermissionByProfile(req.body,function(obj) {
            res.status(obj.status).send(obj)
        })
    }else {
        res.status(400).send({msg: msgs.emptyBody})  
    } 
    
}