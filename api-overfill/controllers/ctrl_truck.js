const model = require('../model/truck/model_truck')
const msgs = require('../commons/allMessages')


exports.allTruck = (req,res) => { 
    model.allTruck(function(obj) {
        res.status(obj.status).send(obj)
    })
}

exports.getTruck = (req,res) => {
    if (req.params.at) {
        model.getTruck(req.params.at,function(obj) {
            res.status(obj.status).send(obj)
        })
    }else {
        res.status(404).send({msg: msgs.emptyBody})          
    } 
}

exports.addTruck = (req,res) => {
    if (req.body) {
        model.addTruck(req.body, function(obj) {
            res.status(obj.status).send(obj)})
    }else {
        res.status(400).send({msg: msgs.emptyBody})  
    } 
} 

exports.deleteTruck = (req,res) => {
    if (req.body.id) {
        model.deleteTruck(req.body.id, function(obj) {
             res.status(obj.status).send(obj)})
    }else {
        res.status(400).send({msg: msgs.emptyBody})  
    } 
}

exports.editTruck = (req,res) => {
    if (req.params.id) {
        model.editTruck(req.params.id, function(obj) {
            res.status(obj.status).send(obj)
        })
    }else {
        res.status(400).send({msg: msgs.emptyBody})        
    } 
}

exports.reportTruck = (req,res) => {
    if (req.body) {
        model.reportTruck(req.body, function(obj) {
            res.status(obj.status).send(obj)
        })
    }else {
        res.status(400).send({msg: msgs.emptyBody})  
    } 
}

exports.updateTruck = (req,res) => {
    if (req.body) {
        model.updateTruck(req.body, function(obj) {
            res.status(obj.status).send(obj)
        })
    }else {
        res.status(400).send({msg: msgs.emptyBody})  
    } 
}







