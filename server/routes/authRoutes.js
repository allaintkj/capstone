const express = require('express');
const router = express.Router();

const {
    login,
    resetPassword
} = require('../controllers/AuthController');

router.route('/reset/:id')
    .post(resetPassword);

router.route('/login')
    .post(login);

module.exports = router;
