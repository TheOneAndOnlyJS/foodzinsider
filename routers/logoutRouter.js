const express = require('express');
const router = express.Router();
const { handleLogout } = require('../controller/authController');

router.route('/')
.post(handleLogout)

module.exports = router;