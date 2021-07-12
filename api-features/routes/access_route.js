const express = require('express')
const ctrl_access = require('../controllers/ctrl_access')
const router = express.Router()

router.post('/firstLogin/:key?',ctrl_access.firstLogin)
router.post('/login',ctrl_access.login)
router.post('/logout',ctrl_access.logout)
router.post('/recoveryPass',ctrl_access.recoveryPass)
router.post('/changePassword/:key?/:id?',ctrl_access.changePassword)
router.post('/changePasswordUserByAdmin/:id?',ctrl_access.changePasswordUserByAdmin)
router.post('/registerUser',ctrl_access.registerUser)

   
module.exports = router