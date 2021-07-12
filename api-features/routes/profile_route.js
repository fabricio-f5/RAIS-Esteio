const express = require('express')
const ctrl_profile = require('../controllers/ctrl_profile')
const router = express.Router()
const verifyJWT =  require('../Middleware/verifyJWT')

 router.post('/addProfile',verifyJWT,ctrl_profile.addProfile)
 router.post('/deleteProfile',verifyJWT,ctrl_profile.deleteProfile)
 router.get('/editProfile/:id',verifyJWT,ctrl_profile.editProfile)
 router.put('/updateProfile',verifyJWT,ctrl_profile.updateProfile)
 router.get('/allProfile',verifyJWT,ctrl_profile.allProfile)
 router.post('/reportProfile',verifyJWT,ctrl_profile.reportProfile)


   
module.exports = router