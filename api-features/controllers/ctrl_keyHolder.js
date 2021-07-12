const model = require('../model/KeyHolder/model_keyHolder')
const msgs = require('../commons/allMessages')

exports.addKeyHolder = (req,res) => {

        if (req.body) {
            model.addKeyHolder(req.body, function(obj) {
                res.status(obj.status).send(obj)})
        }else {
            res.status(400).send({msg: msgs.emptyBody})  
        } 
  
} 

exports.editKeyHolder = (req,res) => {

    if (req.params.id) {
        model.editKeyHolder(req.params.id, function(obj) {
            res.status(obj.status).send(obj)
        })
    }else {
        res.status(400).send({msg: msgs.emptyBody})        
    } 

}

exports.deleteKeyHolder = (req,res) => {

        if (req.body.id) {
            model.deleteKeyHolder(req.body.id, function(obj) {
                 res.status(obj.status).send(obj)})
        }else {
            res.status(400).send({msg: msgs.emptyBody})  
        } 
  
}

exports.allKeyHolder = (req,res) => {

        if (req.body) {
            model.allKeyHolder(function(obj) {
                res.status(obj.status).send(obj)
            })
        }else {
            res.status(400).send({msg: msgs.emptyBody})  
        } 
  
}

exports.reportKeyHolder = (req,res) => {

        if (req.body) {
            model.reportKeyHolder(req.body, function(obj) {
                res.status(obj.status).send(obj)
            })
        }else {
            res.status(400).send({msg: msgs.emptyBody})  
        } 
  
}

exports.updateKeyHolder = (req,res) => {

        if (req.body) {
            model.updateKeyHolder(req.body, function(obj) {
                res.status(obj.status).send(obj)
            })
        }else {
            res.status(400).send({msg: msgs.emptyBody})  
        } 
  
}
