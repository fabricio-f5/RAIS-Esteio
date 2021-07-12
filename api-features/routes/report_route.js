const express = require('express')
const ctrl_reports = require('../controllers/ctrl_reports')
const router = express.Router()
const verifyJWT =  require('../Middleware/verifyJWT')

 router.post('/reportsKeyHolder',verifyJWT,ctrl_reports.reportsKeyHolder)
 

   
module.exports = router