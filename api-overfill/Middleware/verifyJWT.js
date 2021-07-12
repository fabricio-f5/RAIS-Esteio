const msgs = require('../commons/allMessages')
const jwt = require('jsonwebtoken')
const secret = require('../config/secret')
const jsonResponse = require('../commons/DialogReactAndApi')

let jsonRresponse = jsonResponse()

function verifyJWT(req,res,next) { 
     let  token = null 
     token = req.headers['authorization']
     jwt.verify(token,secret,(err) => {
          if (err) { 
                jsonRresponse.msg = msgs.NotAuthorized 
                res.status(401).send(jsonRresponse)
            } else {
                next()
            }
     })    
}
module.exports  =  verifyJWT