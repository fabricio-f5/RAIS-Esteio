const model = require('../model/Access/model_access')
const msgs = require('../commons/allMessages')

exports.registerUser = (req,res) => {

        if (req.body) {
            model.registerUser(req.body, function(obj) {
                res.status(obj.status).send(obj)})
        }else {
            res.status(400).send({msg: msgs.emptyBody})  
        } 
   
}

exports.firstLogin = (req,res) => {

        if (req.body) {
            model.firstLogin(req.params.key,req.body,function(obj) {
                res.status(obj.status).send(obj)
        })
        }else {
            res.status(400).send({msg: msgs.emptyBody})        
        } 
 
}

exports.login = (req,res) => {

        if (req.body) {
            model.login(req.body,function(obj) {
                res.status(obj.status).send(obj)
        })
        }else {
            res.status(400).send({msg: msgs.emptyBody})           
        } 
   
}

exports.recoveryPass = (req,res) => {

        if (req.body) {
            model.recoveryPass(req.body,function(obj) {
                res.status(obj.status).send(obj)
        })
        }else {
            res.status(400).send({msg: msgs.emptyBody})           
        } 
  
}

exports.changePassword = (req,res) => {
    if (req.body) {
        model.changePassword(req.params.key,req.params.id,req.body,function(obj) {
            res.status(obj.status).send(obj)
    })
    }else {
        res.status(400).send({msg: msgs.emptyBody})           
    } 
}

exports.changePasswordUserByAdmin = (req,res) => {
    if (req.body) {
        model.changePasswordUserByAdmin(req.params.id,req.body,function(obj) {
            res.status(obj.status).send(obj)
    })
    }else {
        res.status(400).send({msg: msgs.emptyBody})           
    } 
}

exports.logout = (req,res) => {

        if (req.body) {
            model.logout(req.body,function(obj) {
                res.status(obj.status).send(obj)
        })
        }else {
            res.status(400).send({msg: msgs.emptyBody})      
        } 

}

