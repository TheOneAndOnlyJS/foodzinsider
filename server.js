const express = require('express');
const server = express();
const path = require('path')
const fs = require('fs');
const multer = require('multer');
const cookie = require('cookie-parser');


server.use(cookie())
server.use(express.static(path.join(__dirname, '/public')))
server.use(express.json())
server.set('view engine', 'ejs')
server.use(express.urlencoded({ extended: false }))

const PORT = process.env.PORT || 7000

server.use('/', require('./routers/basicRouters'));
const upload = multer({ dest: 'public/uploads/' });
server.use('/post', upload.single('file'), require('./routers/createPostRoute'));
server.use('/register', require('./routers/registerRoute'));
server.use('/login', require('./routers/loginRouter'))
server.use('/logout', require('./routers/logoutRouter'))

server.listen(PORT, () => {return console.log(`Server running on port ${PORT}`)})