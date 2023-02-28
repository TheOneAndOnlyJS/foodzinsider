const express = require('express');
const router = express.Router();
const { handleLogin, handleLogout } = require('../controller/authController');

router.route('/')
.get((req, res) => {res.render('users/login')})
.post(handleLogin)

module.exports = router;