const asyncHandler = require('express-async-handler');
const User = require('../models/UserModel');
const mongoose = require('mongoose');
const generateToken = require('../Config/generateToken');
const bcrypt = require('bcryptjs');

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, profilePic } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        profilePic
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic,
            //token : generateToken(user._id)
        });
    }else{
        res.status(400);
        throw new Error("Registration failed");
    }
});

const authUser = asyncHandler(async (req, res) => {

    // loging in user
    const { email, password } = req.body;

    //decrypting password

    const userExists = await User.findOne({ email });

    if (userExists && (await bcrypt.compare(password, userExists.password))) {
        

        // generate token
        const token = await userExists.generateToken();
        
        //generate cookie
        res.cookie('token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });

        res.json({
            _id: userExists._id,
            name: userExists.name,
            email: userExists.email,
            profilePic: userExists.profilePic,
           // token : generateToken(userExists._id)
        });
        
    }
    else {
        res.status(401).json({error:"Invalid Credentials"})
        //throw new Error("Invalid email or password");
    }
});

module.exports = {registerUser , authUser}