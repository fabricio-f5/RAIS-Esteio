const model = require('../model/RoutePermission/model_routePermission')
const msgs = require('../commons/allMessages')


exports.addRoute = (req,res) => {

        if (req.body) {
            model.addRoute(req.body, function(obj) {
                res.status(obj.status).send(obj)})
        }else {
            res.status(400).send({msg: msgs.emptyBody})  
        } 
 
}

exports.deleteRoute = (req,res) => {

        if (req.body.id) {
            model.deleteRoute(req.body.id, function(obj) {
                 res.status(obj.status).send(obj)})
        }else {
            res.status(400).send({msg: msgs.emptyBody})  
        } 
 
}

exports.editRoute = (req,res) => {

        if (req.params.id) {
            model.editRoute(req.params.id, function(obj) {
                res.status(obj.status).send(obj)
            })
        }else {
            res.status(400).send({msg: msgs.emptyBody})        
        } 
 
}

exports.allRoute = (req,res) => {

        if (req.body) {
            model.allRoute(function(obj) {
                res.status(obj.status).send(obj)
            })
        }else {
            res.status(400).send({msg: msgs.emptyBody})  
        } 
 
}

exports.reportRoute = (req,res) => {

        if (req.body) {
            model.reportRoute(req.body, function(obj) {
                res.status(obj.status).send(obj)
            })
        }else {
            res.status(400).send({msg: msgs.emptyBody})  
        } 
 
}

exports.updateRoute = (req,res) => {

        if (req.body) {
            model.updateRoute(req.body, function(obj) {
                res.status(obj.status).send(obj)
            })
        }else {
            res.status(400).send({msg: msgs.emptyBody})  
        } 
 
}