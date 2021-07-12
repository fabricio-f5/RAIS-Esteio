const express = require('express')
const ctrl_truck = require('../controllers/ctrl_truck')
const router = express.Router()
const verifyJWT =  require('../Middleware/verifyJWT')

router.get('/getTruck/:at',verifyJWT,ctrl_truck.getTruck)
router.post('/addTruck',verifyJWT,ctrl_truck.addTruck)
router.post('/deleteTruck',verifyJWT,ctrl_truck.deleteTruck)
router.get('/editTruck/:id',verifyJWT,ctrl_truck.editTruck)
router.put('/updateTruck',verifyJWT,ctrl_truck.updateTruck)
router.get('/allTruck',verifyJWT,ctrl_truck.allTruck)
router.post('/reportTruck',verifyJWT,ctrl_truck.reportTruck)

module.exports = router