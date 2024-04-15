const express = require('express');
const loginController = require('../controllers/login.controller');

const router = express.Router();

router.get('/logIn', loginController.logIn)
router.get('/signUp', loginController.signUp)

module.exports = router;