const User = require('../models/user');
const bcrypt = require('bcrypt');
const authController = require('../controllers/authController');
const path = require('path');

let filePath = path.join(__dirname, '../../frontend/views/');

module.exports.getRegistration = (req,res)=>{
    res.status(200).sendFile(filePath + '/registration.html');
}

module.exports.postRegister = async (req, res) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        const createdUser = await User.create(req.body);

        const token = await authController.generateToken({ id: createdUser.id, email: createdUser.email });

        let tokens = [];
        if (createdUser.tokens && createdUser.tokens.length > 0) {
            tokens = JSON.parse(createdUser.tokens);
        }
        tokens.push(token);
        createdUser.tokens = JSON.stringify(tokens);

        await createdUser.save();
        res.status(201).json({ user: createdUser.first_name, success: true, token: token, message: "Registration Successful" });
    } catch (error) {
        if (Array.isArray(error.errors))
            res.status(500).json({ message: "Internal Server Error", success: false, error: error.errors[0].message });
        else
            res.status(500).json({ message: "Internal Server Error", success: false, error: error });
        console.log(error);
    }
}

module.exports.getLoginUser = (req, res) => {
    res.status(200).sendFile(filePath + '/login.html');
}

module.exports.postLoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            res.status(404).json({ message: "User not found, please register", success: false, error: "404 error, User not found" });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid email or password", success: false, error: "401 error, Unauthorized" });
            return;
        }

        const token = await authController.generateToken({ id: user.id, email: user.email });

        let tokens = [];
        if (user.tokens && user.tokens.length > 0) {
            tokens = JSON.parse(user.tokens);
        }
        tokens.push(token);
        user.tokens = JSON.stringify(tokens);

        await user.save();
        res.status(201).json({ user: user.first_name, success: true, token: token, message: "Login Successful" });

    } catch (error) {
        if (Array.isArray(error.errors))
            res.status(500).json({ message: "Internal Server Error", success: false, error: error.errors[0].message });
        else
            res.status(500).json({ message: "Internal Server Error", success: false, error: error });
        console.log(error);
    }
}

