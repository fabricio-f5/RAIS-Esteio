const model = require('../model/AvaliableKey/model_avaliableKey')
const msgs = require('../commons/allMessages')

exports.addAvaliableKey = (req,res) => {

        if (req.body) {
            model.addAvaliableKey(req.body, function(obj) {
                res.status(obj.status).send(obj)})
        }else {
            res.status(400).send({msg: msgs.emptyBody})  
        } 
  
} 

exports.addGroupOfAvaliableKey = (req,res) => {
    if (req.body) {
        model.addGroupOfAvaliableKey(req.body, function(obj) {
            res.status(obj.status).send(obj)})
    }else {
        res.status(400).send({msg: msgs.emptyBody})  
    } 
} 


exports.editAvaliableKey = (req,res) => {

    if (req.params.id) {
        model.editAvaliableKey(req.params.id, function(obj) {
            res.status(obj.status).send(obj)
        })
    }else {
        res.status(400).send({msg: msgs.emptyBody})        
    } 

}

exports.getAvaliableKey = (req,res) => {

    if (req.params.number) {
        model.getAvaliableKey(req.params.number, function(obj) {
            res.status(obj.status).send(obj)
        })
    }else {
        res.status(400).send({msg: msgs.emptyBody})        
    } 

}

exports.deleteAvaliableKey = (req,res) => {

        if (req.body.id) {
            model.deleteAvaliableKey(req.body.id, function(obj) {
                 res.status(obj.status).send(obj)})
        }else {
            res.status(400).send({msg: msgs.emptyBody})  
        } 
  
}

exports.deleteAllAvaliableKey = (req,res) => {
    model.deleteAllAvaliableKey(function(obj) {
            res.status(obj.status).send(obj)
    })
}

exports.allAvaliableKey = (req,res) => {

        if (req.body) {
            model.allAvaliableKey(function(obj) {
                res.status(obj.status).send(obj)
            })
        }else {
            res.status(400).send({msg: msgs.emptyBody})  
        } 
  
}

exports.getAvaliableKeyByKeyHolder = (req,res) => {
    if (req.body) {
        model.getAvaliableKeyByKeyHolder(req.body,function(obj) {
            res.status(obj.status).send(obj)
        })
    }else {
        res.status(400).send({msg: msgs.emptyBody})  
    } 

}

exports.reportAvaliableKey = (req,res) => {

        if (req.body) {
            model.reportAvaliableKey(req.body, function(obj) {
                res.status(obj.status).send(obj)
            })
        }else {
            res.status(400).send({msg: msgs.emptyBody})  
        } 
  
}

exports.updateAvaliableKey = (req,res) => {

        if (req.body) {
            model.updateAvaliableKey(req.body, function(obj) {
                res.status(obj.status).send(obj)
            })
        }else {
            res.status(400).send({msg: msgs.emptyBody})  
        } 
  
}

exports.VerifyRFIDAssociated = (req,res) => {

    if (req.params.rfid) { 
        model.VerifyRFIDAssociated(req.params.rfid,function(obj) {
            res.status(obj.status).send(obj)
        })
    } else {
        res.status(400).send({msg: msgs.emptyBody})  
    }
}

exports.UpdateKeys = (req,res) => {
    if (req.params.rfid &&  req.params.keyHolderNumber) { 
        model.UpdateKeys(req.params.keyHolderNumber,req.params.rfid,req.body, function(obj) {
            res.status(obj.status).send(obj)
        })
    } else {
        res.status(400).send({msg: msgs.emptyBody})  
    }
}

exports.clearRFID = (req,res) => {
    model.clearRFID(function(obj) {
        res.status(obj.status).send(obj)
    })
}

exports.getRFID = (req,res) => {
    model.getRFID(function(obj) {
        res.status(obj.status).send(obj)
    })
}

exports.AssociateUserAndRFID = (req,res) => {
    if (req.params.userId) { 
        model.AssociateUserAndRFID(req.params.userId,function(obj) {
            res.status(obj.status).send(obj)
        })
    } else {
        res.status(400).send({msg: msgs.emptyBody})
    }
}






