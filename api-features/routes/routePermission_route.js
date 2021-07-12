const express = require('express')
const ctrl_routePermission = require('../controllers/ctrl_routePermission')
const router = express.Router()
const verifyJWT =  require('../Middleware/verifyJWT')

 router.post('/addRoute',verifyJWT,ctrl_routePermission.addRoute)
 router.post('/deleteRoute',verifyJWT,ctrl_routePermission.deleteRoute)
 router.get('/editRoute/:id',verifyJWT,ctrl_routePermission.editRoute)
 router.put('/updateRoute',verifyJWT,ctrl_routePermission.updateRoute)
 router.get('/allRoute',verifyJWT,ctrl_routePermission.allRoute)
 router.post('/reportRoute',verifyJWT,ctrl_routePermission.reportRoute)
   
module.exports = router