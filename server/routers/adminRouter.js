const express = require('express')
const router=express.Router()
const adminController = require('../controllers/adminController')


router.get('/fetchusertoadmin',adminController.fetchUserDetails)
router.delete('/deleteuser',adminController.deleteUser)
router.post('/edituser',adminController.editUser)
router.post('/adduser',adminController.addUser)


module.exports=router;