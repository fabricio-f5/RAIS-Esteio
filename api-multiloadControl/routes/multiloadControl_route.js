const express = require('express')
const ctrl_multiloadControl = require('../controllers/ctrl_multiloadControl')
const router = express.Router()
const verifyJWT =  require('../Middleware/verifyJWT')

router.get('/getMultiload/:bayNumber',verifyJWT,ctrl_multiloadControl.getMultiload)
router.post('/addMultiload',verifyJWT,ctrl_multiloadControl.addMultiload)
router.post('/deleteMultiload',verifyJWT,ctrl_multiloadControl.deleteMultiload)
router.get('/editMultiload/:id',verifyJWT,ctrl_multiloadControl.editMultiload)
router.put('/updateMultiload',verifyJWT,ctrl_multiloadControl.updateMultiload)
router.put('/setStatusMultiload/:statusField/:statusValue',verifyJWT,ctrl_multiloadControl.setStatusMultiload)
router.get('/allMultiload',verifyJWT,ctrl_multiloadControl.allMultiload)
router.post('/reportMultiload',verifyJWT,ctrl_multiloadControl.reportMultiload)

module.exports = router