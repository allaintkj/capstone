const express = require('express');
const router = express.Router();

const {
    login
} = require('../controllers/AuthController');

router.route('/')
    .get(login);

module.exports = router;
