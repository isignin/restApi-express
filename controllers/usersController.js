// /controllers/userController.js

"use strict";

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user');

exports.index = (req, res, next) => {
    User.find()
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                users: docs.map(doc => {
                    return {
                        name: doc.name,
                        email: doc.email,
                        id: doc._id
                    }
                })
            }
            if (docs.length > 0){
              res.status(200).json(response);
            } else {
                res.status(200).json({
                    message: 'No records found in DB'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
};

exports.show = (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
        .exec()
        .then(doc => {
            const response = {
                user: {
                        name: doc.name,
                        email: doc.email,
                        id: doc._id
                    }
            }
            if (doc) {
                res.status(200).json(response);
            } else {
                res.status(404).json({
                    message: "No valid entry found for User ID"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.signup = (req, res, next) => {
    // confirm that user typed same password twice
    if (req.body.password !== req.body.passwordConf) {
        const err = new Error('Passwords do not match.');
        err.status = 400;
        res.send("passwords dont match");
        return next(err);
    };
    
    if (req.body.email &&
        req.body.name &&
        req.body.password ) {

        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        user.save()
        .then(result => {
            console.log(result);
            res.status(201).json(user);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    } else {
        const msg = "Missing one or more required field(s)";
        console.log(msg);
        res.status(500).json({
            message: msg
        });
    }
};

exports.login = (req, res, next) => {
    
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
                    const jwt_token = jwt.sign({user: response}, config.JWT_KEY, { expiresIn: "1hr"});
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
};

exports.update = (req, res, next) => {
    const id = req.params.userId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    User.updateOne({_id: id}, {$set: updateOps})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Updated User' ,
                id: id
            });
            //res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.delete = (req, res, next) => {
    const id = req.params.userId;
    User.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Deleted User' ,
                id: id
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });    
};
