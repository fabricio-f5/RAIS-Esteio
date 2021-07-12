const model = require('../model/multiloadControl/model_multiloadControl')
const msgs = require('../commons/allMessages')


exports.allMultiload = (req,res) => { 
    model.allMultiload(function(obj) {
        res.status(obj.status).send(obj)
    })
}

exports.getMultiload = (req,res) => {
    if (req.params.bayNumber) {
        model.getMultiload(req.params.bayNumber,function(obj) {
            res.status(obj.status).send(obj)
        })
    }else {
        res.status(404).send({msg: msgs.emptyBody})          
    } 
}

exports.addMultiload = (req,res) => {
    if (req.body) {
        model.addMultiload(req.body, function(obj) {
            res.status(obj.status).send(obj)})
    }else {
        res.status(400).send({msg: msgs.emptyBody})  
    } 
} 

exports.deleteMultiload = (req,res) => {
    if (req.body.id) {
        model.deleteMultiload(req.body.id, function(obj) {
             res.status(obj.status).send(obj)})
    }else {
        res.status(400).send({msg: msgs.emptyBody})  
    } 
}

exports.editMultiload = (req,res) => {
    if (req.params.id) {
        model.editMultiload(req.params.id, function(obj) {
            res.status(obj.status).send(obj)
        })
    }else {
        res.status(400).send({msg: msgs.emptyBody})        
    } 
}

exports.reportMultiload = (req,res) => {
    if (req.body) {
        model.reportMultiload(req.body, function(obj) {
            res.status(obj.status).send(obj)
        })
    }else {
        res.status(400).send({msg: msgs.emptyBody})  
    } 
}

exports.updateMultiload = (req,res) => {
    if (req.body) {
        model.updateMultiload(req.body, function(obj) {
            res.status(obj.status).send(obj)
        })
    }else {
        res.status(400).send({msg: msgs.emptyBody})  
    } 
}

exports.setStatusMultiload = (req,res) => {
        if (req.body && req.params.statusField && req.params.statusValue) {
            model.setStatusMultiload(req.body,req.params.statusField,req.params.statusValue,function(obj) {
                res.status(obj.status).send(obj)
            })
        }else {
            res.status(400).send({msg: msgs.emptyBody})  
        } 
}





