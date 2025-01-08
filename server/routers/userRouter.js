const express = require('express')
const userAuth=require('../middlewares/userAuthentication')
const userController = require('../controllers/userController')
const multer = require('multer');
const storage = require("../multer/multerConfig");
const router = express.Router()
const upload = multer({ storage: storage });


router.post("/signup",userController.postSignup)
router.post('/login',userController.login)
router.get('/logout',userAuth,userController.logout)
router.get('/fetchuserdata',userController.fetchData)
router.post('/editprofile',userController.editprofile)
router.post('/uploadprofileimage',upload.single('profile'),userController.uploadImage)




module.exports = router;