// /auth/authorization.js
"use strict";

var jwt = require('jsonwebtoken');
var config = require('../config');

var authorization = function (req, res, next) {

    var token = req.headers['x-access-token'] || (req.body && req.body.access_token) || (req.query && req.query.access_token);
    if (!token)
        res.status(500).json({
            auth: false, 
            message: 'No token provided.'
        });
    try {
        jwt.verify(token, config.JWT_KEY, function (err, decoded) {
            req.userId = decoded.id;
            next();
        });
    } catch (error) {
        return res.status(401).json({
            auth: false, 
            message: 'Failed to authenticate token.'
        });
    }
}

module.exports = authorization;