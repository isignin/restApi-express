const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

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
                res.status(200).json(user);
                // req.session.userId = user._id;
                // return res.redirect('/profile');
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