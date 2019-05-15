const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const users_controller = require('../controllers/usersController');

router.get('/', users_controller.index);

router.get('/:userId', users_controller.show);

router.post('/signup', users_controller.signup);

router.post('/login', users_controller.login);

router.patch('/:userId', users_controller.update);

router.delete('/:userId', users_controller.delete);

module.exports = router;