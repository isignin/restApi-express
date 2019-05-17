// /models/user.js
"use strict";

const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    name: {
        type: String,
        unique: false,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    }
});

//authenticate input against database
userSchema.statics.authenticate = function (email, password, callback) {
    User.findOne({ email: email })
    .exec()
    .then(user => {
        if (user) {
            bcrypt.compare(password, user.password, function (err, result) {
            if (result === true) {
                return callback(null, user);
            } else {
                return callback();
            }
            });
        } else {
            return callback();
        }
    })
    .catch(err => {
        console.log(err);
        return callback(err);
    });
}

//hashing a password before saving it to the database
userSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash){
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    })
  });
var User = mongoose.model('User', userSchema);
module.exports = User;