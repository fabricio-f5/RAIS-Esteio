const express = require('express')
const ctrl_report = require('../controllers/ctrl_report')
const router = express.Router()
const verifyJWT =  require('../Middleware/verifyJWT')

 router.post('/reportOverfill/:purgeDaysPeriod',verifyJWT,ctrl_report.reportOverfill)
 
   
module.exports = router