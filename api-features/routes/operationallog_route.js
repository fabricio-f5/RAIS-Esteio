const express = require('express')
const ctrl_operationaLog = require('../controllers/ctrl_operationaLog')
const router = express.Router()
const verifyJWT =  require('../Middleware/verifyJWT')

router.post('/reportConfigParameter',verifyJWT,ctrl_operationaLog.reportOperationaLog)
module.exports = router