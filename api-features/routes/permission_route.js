const express = require('express')
const ctrl_Permission = require('../controllers/ctrl_permission')
const router = express.Router()
const verifyJWT =  require('../Middleware/verifyJWT')

 router.post('/addPermission',verifyJWT,ctrl_Permission.addPermission)
 router.post('/deletePermission',verifyJWT,ctrl_Permission.deletePermission)
 router.get('/editPermission/:id',verifyJWT,ctrl_Permission.editPermission)
 router.put('/updatePermission',verifyJWT,ctrl_Permission.updatePermission)
 router.get('/allPermission',verifyJWT,ctrl_Permission.allPermission)
 router.post('/getPermissionByProfile',verifyJWT,ctrl_Permission.getPermissionByProfile)
 router.post('/reportPermission',verifyJWT,ctrl_Permission.reportPermission)
   
module.exports = router