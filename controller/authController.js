const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userDB = {
    users: require('../model/users.json')
}

require('dotenv').config();


const handleLogin = async (req, res) => {
    const { user, pass } = req.body

    const foundUser = await userDB.users.find(User => User.username === user)
    if(!foundUser){
        res.statusCode = 401 //Unautharized
        res.send('Message: Such a user does not exist');
    }

    const match = await bcrypt.compare(pass, foundUser.password);

    if(match){
        const jwtToken = jwt.sign(
            {
                "UserInfo": {
                    "username" : foundUser.username
                }
            },
            process.env.SECERT_KEY,
            {expiresIn: "1d"}
        )
        res.cookie('JWT', jwtToken, { httpOnly: true, secure: true , maxAge: 24 * 60 * 60 * 1000})
        res.redirect('/')
    }
    else{
        res.statusCode = 401;
        res.send('<script>alert("Password is Incorrect")</script>');
    }
}

const handleLogout = (req, res) => {
    const cookieJWT = req.cookies.JWT
    if(!cookieJWT){
       return res.sendStatus(204)
    }
    res.clearCookie('JWT', {httpOnly: true, maxAge: 24 * 60 * 60 * 1000})
    res.redirect('/');
}

module.exports = { handleLogin, handleLogout }