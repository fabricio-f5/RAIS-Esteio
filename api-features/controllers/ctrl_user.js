const model = require('../model/User/model_user')
const msgs = require('../commons/allMessages')

exports.addUser = (req,res) => {

        if (req.body) {
            model.addUser(req.body, function(obj) {
                res.status(obj.status).send(obj)})
        }else {
            res.status(400).send({msg: msgs.emptyBody})  
        } 
  
}

exports.deleteUser = (req,res) => {

        if (req.body.id) {
            model.deleteUser(req.body.id, function(obj) {
                 res.status(obj.status).send(obj)})
        }else {
            res.status(400).send({msg: msgs.emptyBody})  
        } 
  
}

exports.editUser = (req,res) => {

        if (req.params.id) {
            model.editUser(req.params.id, function(obj) {
                res.status(obj.status).send(obj)
            })
        }else {
            res.status(400).send({msg: msgs.emptyBody})        
        } 
  
}

exports.allUser = (req,res) => {

        if (req.body) {
            model.allUser(function(obj) {
                res.status(obj.status).send(obj)
            })
        }else {
            res.status(400).send({msg: msgs.emptyBody})  
        } 
  
}

exports.reportUser = (req,res) => {

        if (req.body) {
            model.reportUser(req.body, function(obj) {
                res.status(obj.status).send(obj)
            })
        }else {
            res.status(400).send({msg: msgs.emptyBody})  
        } 
  
}

exports.updateUser = (req,res) => {

        if (req.body) {
            model.updateUser(req.body, function(obj) {
                res.status(obj.status).send(obj)
            })
        }else {
            res.status(400).send({msg: msgs.emptyBody})  
        } 
  
}