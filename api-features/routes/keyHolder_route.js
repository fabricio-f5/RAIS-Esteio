const express = require('express')
const ctrl_keyHolder = require('../controllers/ctrl_keyHolder')
const router = express.Router()
const verifyJWT =  require('../Middleware/verifyJWT')

 router.post('/addKeyHolder',verifyJWT,ctrl_keyHolder.addKeyHolder)
 router.post('/deleteKeyHolder',verifyJWT,ctrl_keyHolder.deleteKeyHolder)
 router.get('/editKeyHolder/:id',verifyJWT,ctrl_keyHolder.editKeyHolder)
 router.put('/updateKeyHolder',verifyJWT,ctrl_keyHolder.updateKeyHolder)
 router.get('/allKeyHolder',verifyJWT,ctrl_keyHolder.allKeyHolder)
 router.post('/reportKeyHolder',verifyJWT,ctrl_keyHolder.reportKeyHolder)
 
   
module.exports = router