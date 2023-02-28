const express = require('express');
const router = express.Router();
const createPost = require('../controller/postCreateController');

router.route('/')
.post(createPost);

module.exports = router;