const model = require('../model/monitorBay/model_monitorBay')
const msgs = require('../commons/allMessages')


exports.allBay = (req,res) => {
    model.allBay(function(obj) {
        res.status(obj.status).send(obj)
    })
}

exports.getBay = (req,res) => {
    if (req.params.bayNumber) {
        model.getBay(req.params.bayNumber,function(obj) {
            res.status(obj.status).send(obj)
        })
    }else {
        res.status(404).send({msg: msgs.emptyBody})          
    } 
}

exports.clearBay = (req,res) => {
    if (req.params.bayNumber) {
        model.clearBay(req.params.bayNumber,function(obj) {
            res.status(obj.status).send(obj)
        })
    }else {
        res.status(404).send({msg: msgs.emptyBody})          
    } 
}

exports.setBay = (req,res) => {
    if (req.body) {
        model.setBay(req.body, function(obj) {
            res.status(obj.status).send(obj)})
    }else {
        res.status(400).send({msg: msgs.emptyBody})  
    } 
} 









