const express = require('express')
const ctrl_mail = require('../controllers/ctrl_mail')
const router = express.Router()
const verifyJWT =  require('../Middleware/verifyJWT')

 router.post('/sendMail',verifyJWT,ctrl_mail.sendMail)
 
module.exports = router