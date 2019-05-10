const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const User = require('../models/user');

router.get('/',(req, res, next) => {
    User.find()
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length > 0){
              res.status(200).json(docs);
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
});

router.get('/:userId',(req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
        .exec()
        .then(doc => {
            console.log(doc)
            if (doc) {
                res.status(200).json(doc);
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
});

router.post('/',(req, res, next) => {
    // confirm that user typed same password twice
    if (req.body.password !== req.body.passwordConf) {
        const err = new Error('Passwords do not match.');
        err.status = 400;
        res.send("passwords dont match");
        return next(err);
    };
    
    if (req.body.username &&
        req.body.email &&
        req.body.name &&
        req.body.password ) {

        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            username: req.body.username,
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
});

router.patch('/:userId',(req, res, next) => {

    const id = req.params.userId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    User.update({_id: id}, {$set: updateOps})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
    res.status(200).json({
        message: 'Updated User' ,
        id: id
    });
});

router.delete('/:userId',(req, res, next) => {
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
});

module.exports = router;