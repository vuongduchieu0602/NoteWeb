const express = require('express');
const argon2 = require('argon2');
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../models/User');

//@route POST api/auth/register
//@desc register user
//@access Public

router.post('/register', async(req, res) => {
    const {username, password} = req.body;
    if(!username || !password){
        return res
            .status(400)
            .json({success: false, message:"Missing username and/or password!"});
    }
    try {
        const user = await User.findOne({username});
        if(user){
        return res
            .status(400)
            .json({success: false, message: "Username already taken"});
    }

    const hashedPassword = await argon2.hash(password);
    const newUser = new User({
        username,
        password: hashedPassword
    });
    await newUser.save();

    const accessToken = jwt.sign({userId: newUser._id}, process.env.ACCESS_TOKEN_SECRET);

    res
        .status(200)
        .json({success: true, message: "Username created successfully", accessToken});
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({success: false, message: "Internal server error"});
    }
})

//@route POST api/auth/login
//@desc Login user
//@access Public

router.post('/login', async(req, res) => {
    const {username, password} = req.body;
    if(!username || !password){
        return res
            .status(400)
            .json({success: false, message: "Missing username and/or password"})
    }
    try {
        const user = await User.findOne({username});
        if(!user)
        {
            return res
                .status(400)
                .json({success: false, message: "Incorrect username or password"});
        }

        const passwordValid =  await argon2.verify(user.password, password);
        if(!passwordValid){
            return res
                .status(400)
                .json({success: false, message: "Incorrect username or password"});
        }
        const accessToken = jwt.sign({userId:user._id},process.env.ACCESS_TOKEN_SECRET);
        res
            .status(200)
            .json({success: true, message: "Logged in successfully", accessToken});
    } catch (error) {
        
    }
})
module.exports = router;