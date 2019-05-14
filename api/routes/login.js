const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.post('/',(req, res, next) => {
    
    if (req.body.email &&
        req.body.password) {
        
        const email = req.body.email;
        const password = req.body.password;

        User.authenticate(email, password, function (error, user) {
            if (error || !user) {
                var err = new Error('Wrong email or password.');
                err.status = 401;
                return next(err);
            } else {
                console.log("User found...");
                const response = {
                    name: user.name,
                    email: user.email,
                    id: user._id
                };
                //jwt.sign is synchronous, hence use try..catch
                try {
                    const jwt_token = jwt.sign({user: response}, process.env.JWT_KEY, { expiresIn: "1hr"});
                    response.token = jwt_token;
                    res.status(200).json(response);
                } 
                catch (err) {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                }
            }
        });
    } else {
        const msg = "Missing one or more required field(s)";
        console.log(msg);
        res.status(500).json({
            message: msg
        });
    }
});


module.exports = router;