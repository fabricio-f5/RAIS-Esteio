const model = require('../model/driverSms/model_driverSms')
const msgs = require('../commons/allMessages')


exports.allDriver = (req,res) => {
    model.allDriverSms(function(obj) {
        res.status(obj.status).send(obj)
    })

}

exports.getDriver = (req,res) => {
    if (req.params.code) {
        model.getDriverSms(req.params.code,function(obj) {
            res.status(obj.status).send(obj)
        })
    }else {
        res.status(404).send({msg: msgs.emptyBody})          
    } 
}

exports.addDriver = (req,res) => {
    if (req.body) {
        model.addDriverSms(req.body, function(obj) {
            res.status(obj.status).send(obj)})
    }else {
        res.status(400).send({msg: msgs.emptyBody})  
    } 
} 

exports.deleteDriver = (req,res) => {
    if (req.body.id) {
        model.deleteDriverSms(req.body.id, function(obj) {
             res.status(obj.status).send(obj)})
    }else {
        res.status(400).send({msg: msgs.emptyBody})  
    } 
}

exports.editDriver = (req,res) => {
    if (req.params.id) {
        model.editDriverSms(req.params.id, function(obj) {
            res.status(obj.status).send(obj)
        })
    }else {
        res.status(400).send({msg: msgs.emptyBody})        
    } 

}

exports.reportDriver = (req,res) => {
    if (req.body) {
        model.reportDriverSms(req.body, function(obj) {
            res.status(obj.status).send(obj)
        })
    }else {
        res.status(400).send({msg: msgs.emptyBody})  
    } 
}

exports.updateDriver = (req,res) => {
    if (req.body) {
        model.updateDriverSms(req.body, function(obj) {
            res.status(obj.status).send(obj)
        })
    }else {
        res.status(400).send({msg: msgs.emptyBody})  
    } 
}







