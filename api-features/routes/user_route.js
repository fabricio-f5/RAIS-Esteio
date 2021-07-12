const express = require('express')
const ctrl_user = require('../controllers/ctrl_user')
const router = express.Router()
const verifyJWT =  require('../Middleware/verifyJWT')

 router.post('/addUser',verifyJWT,ctrl_user.addUser)
 router.post('/deleteUser/',verifyJWT,ctrl_user.deleteUser)
 router.get('/editUser/:id',verifyJWT,ctrl_user.editUser)
 router.put('/updateUser',verifyJWT,ctrl_user.updateUser)
 router.get('/allUser',verifyJWT,ctrl_user.allUser)
 router.post('/reportUser',verifyJWT,ctrl_user.reportUser)

 
  
module.exports = router
