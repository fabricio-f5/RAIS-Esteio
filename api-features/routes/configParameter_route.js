const express = require('express')
const ctrl_configParameter = require('../controllers/ctrl_configParameter')
const router = express.Router()
const verifyJWT =  require('../Middleware/verifyJWT')

 router.post('/addConfigParameter',verifyJWT,ctrl_configParameter.addConfigParameter)
 router.post('/deleteConfigParameter',verifyJWT,ctrl_configParameter.deleteConfigParameter)
 router.get('/editConfigParameter/:id',verifyJWT,ctrl_configParameter.editConfigParameter)
 router.put('/updateConfigParameter',verifyJWT,ctrl_configParameter.updateConfigParameter)
 router.get('/allConfigParameter',verifyJWT,ctrl_configParameter.allConfigParameter)
 router.post('/reportConfigParameter',verifyJWT,ctrl_configParameter.reportConfigParameter)
 router.post('/getConfigParameter',ctrl_configParameter.getConfigParameter)
   
module.exports = router