const model = require('../model/ConfigParameter/model_configParameter')
const msgs = require('../commons/allMessages')

exports.addConfigParameter = (req,res) => {

        if (req.body) {
            model.addConfigParameter(req.body, function(obj) {
                res.status(obj.status).send(obj)})
        }else {
            res.status(400).send({msg: msgs.emptyBody})  
        } 
  
} 

exports.deleteConfigParameter = (req,res) => {

        if (req.body.id) {
            model.deleteConfigParameter(req.body.id, function(obj) {
                 res.status(obj.status).send(obj)})
        }else {
            res.status(400).send({msg: msgs.emptyBody})  
        } 
  
}

exports.editConfigParameter = (req,res) => {

        if (req.params.id) {
            model.editConfigParameter(req.params.id, function(obj) {
                res.status(obj.status).send(obj)
            })
        }else {
            res.status(400).send({msg: msgs.emptyBody})        
        } 
  
}

exports.allConfigParameter = (req,res) => {

        if (req.body) {
            model.allConfigParameter(function(obj) {
                res.status(obj.status).send(obj)
            })
        }else {
            res.status(400).send({msg: msgs.emptyBody})  
        } 
  
}

exports.reportConfigParameter = (req,res) => {

        if (req.body) {
            model.reportConfigParameter(req.body, function(obj) {
                res.status(obj.status).send(obj)
            })
        }else {
            res.status(400).send({msg: msgs.emptyBody})  
        } 
  
}

exports.updateConfigParameter = (req,res) => {

        if (req.body) {
            model.updateConfigParameter(req.body, function(obj) {
                res.status(obj.status).send(obj)
            })
        }else {
            res.status(400).send({msg: msgs.emptyBody})  
        } 
  
}

exports.getConfigParameter = (req,res) => {

        if (req.body) {
            model.getConfigParameter(req.body, function(obj) {
                res.status(obj.status).send(obj)
            })
        }else {
            res.status(400).send({msg: msgs.emptyBody})  
        } 
  
}




