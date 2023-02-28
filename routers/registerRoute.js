const express = require('express');
const router = express.Router();
const handleRegister = require('../controller/registerController');

router.route('/')
.get((req, res) => {
    res.render('users/register')
})
.post(handleRegister);

module.exports = router;