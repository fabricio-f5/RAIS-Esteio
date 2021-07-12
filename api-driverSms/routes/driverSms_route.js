const express = require('express')
const ctrl_driverSms = require('../controllers/ctrl_driverSms')
const router = express.Router()
const verifyJWT =  require('../Middleware/verifyJWT')

router.get('/getDriver/:code',ctrl_driverSms.getDriver)
router.post('/addDriver',ctrl_driverSms.addDriver)
router.post('/deleteDriver',verifyJWT,ctrl_driverSms.deleteDriver)
router.get('/editDriver/:id',verifyJWT,ctrl_driverSms.editDriver)
router.put('/updateDriver',verifyJWT,ctrl_driverSms.updateDriver)
router.get('/allDriver',verifyJWT,ctrl_driverSms.allDriver)
router.post('/reportDriver',verifyJWT,ctrl_driverSms.reportDriver)

module.exports = router