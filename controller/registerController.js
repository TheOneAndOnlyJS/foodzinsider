const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path')
const UserDB = {
    users: require('../model/users.json'),
    setUser: function(data){
        this.users = data
    }
}

require('dotenv').config();

const handleRegister = async(req, res) => {
    const {user, pass} = req.body;

    if(!user || !pass) {
        return res.send('Please fill both fields');
    }

    const duplicate = UserDB.users.includes(User => User.username === user);

    if(duplicate){
        res.sendStatus(409);
        res.send('User already exists');
    }

    try{
        const hashedPassword = await bcrypt.hash(pass, 10);

        const newUser = {
            "username": user,
            "password": hashedPassword
        }

        UserDB.setUser([...UserDB.users, newUser]);
        await fs.promises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(UserDB.users))
        res.redirect('/')
    }
    catch(error){
        if(error){
            throw error;
        }
    }
}

module.exports = handleRegister;
