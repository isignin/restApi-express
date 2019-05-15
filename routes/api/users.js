// /routes/api/users.js
"use strict";

const express = require('express');
const router = express.Router();

const User = require('../../models/user');
const users_controller = require('../../controllers/usersController');
const Authorization = require('../../auth/authorization');

router.get('/', Authorization, users_controller.index);

router.get('/:userId', Authorization, users_controller.show);

router.post('/signup', users_controller.signup);

router.post('/login', users_controller.login);

router.patch('/:userId', Authorization, users_controller.update);

router.delete('/:userId', Authorization, users_controller.delete);

module.exports = router;