const express = require('express')
const ctrl_monitorBay = require('../controllers/ctrl_monitorBay')
const router = express.Router()
const verifyJWT =  require('../Middleware/verifyJWT')

router.get('/allBay',verifyJWT,ctrl_monitorBay.allBay)
router.get('/getBay/:bayNumber',verifyJWT,ctrl_monitorBay.getBay)
router.put('/setBay',verifyJWT,ctrl_monitorBay.setBay)
router.put('/clearBay/:bayNumber',verifyJWT,ctrl_monitorBay.clearBay)

module.exports = router