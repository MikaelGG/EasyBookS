const express = require('express');
const loginController = require('../controllers/login.controller');

const router = express.Router();

router.get('/home', loginController.home)
router.get('/logIn', loginController.logIn)
router.get('/user', loginController.user)
router.post("/logIn", loginController.auth)
router.get('/signUp', loginController.signUp)
router.get('/admin/signUp', loginController.signUpAdmin)
router.get('/admin/addBook', loginController.addBook)
router.post('/signUp', loginController.storeUser)
router.post('/admin/signUp', loginController.storeAdmin)
router.post('/admin/addBook', loginController.storeBook)
router.get('/admin', loginController.admin)
router.get('/logOut', loginController.logOut)


module.exports = router;