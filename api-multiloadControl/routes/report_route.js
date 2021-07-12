const express = require('express')
const ctrl_report = require('../controllers/ctrl_report')
const router = express.Router()
const verifyJWT =  require('../Middleware/verifyJWT')

 router.post('/reportMultiloadControl/:purgeDaysPeriod',verifyJWT,ctrl_report.reportMultiloadControl)
 
   
module.exports = router