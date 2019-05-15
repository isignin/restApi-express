// /routes/users.js
// /routes/users.js
"use strict";

const express = require('express');
const router = express.Router();

const users_controller = require('../controllers/usersController');

/* GET users listing. */
router.get('/', users_controller.index);

module.exports = router;