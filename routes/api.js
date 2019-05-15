// /routes/api.js
"use strict";

var express = require('express')

var router = express.Router()
var users = require('./api/users')
router.use('/users', users);

module.exports = router;
