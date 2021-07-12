const model = require('../model/Profile/model_profile')
const msgs = require('../commons/allMessages')

exports.addProfile = (req,res) => {

        if (req.body) {
            model.addProfile(req.body, function(obj) {
                res.status(obj.status).send(obj)})
        }else {
            res.status(400).send({msg: msgs.emptyBody})  
        } 
  
}

exports.deleteProfile = (req,res) => {

        if (req.body.id) {
            model.deleteProfile(req.body.id, function(obj) {
                 res.status(obj.status).send(obj)})
        }else {
            res.status(400).send({msg: msgs.emptyBody})  
        } 
  
}

exports.editProfile = (req,res) => {

        if (req.params.id) {
            model.editProfile(req.params.id, function(obj) {
                res.status(obj.status).send(obj)
            })
        }else {
            res.status(400).send({msg: msgs.emptyBody})        
        } 
  
}

exports.allProfile = (req,res) => {

        if (req.body) {
            model.allProfile(function(obj) {
                res.status(obj.status).send(obj)
            })
        }else {
            res.status(400).send({msg: msgs.emptyBody})  
        } 
  
}

exports.reportProfile = (req,res) => {

        if (req.body) {
            model.reportProfile(req.body, function(obj) {
                res.status(obj.status).send(obj)
            })
        }else {
            res.status(400).send({msg: msgs.emptyBody})  
        } 
  
}

exports.updateProfile = (req,res) => {

        if (req.body) {
            model.updateProfile(req.body, function(obj) {
                res.status(obj.status).send(obj)
            })
        }else {
            res.status(400).send({msg: msgs.emptyBody})  
        } 
  
}