const jwt = require('jsonwebtoken');

const config = require('../config/config.json');

exports.createToken = payload => {
    // Generate a new JWT with a fresh expiry
    return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiry });
};

exports.verifyToken = request => {
    let token;

    // Old method uses 'token' header
    if (request.header('token')) { token = request.header('token'); }
    // New method uses proper authorization header
    if (request.header('authorization')) { token = request.header('authorization').split(' ')[1]; }

    // Decode payload and check for 'admin' flag
    let payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

    if (!payload.admin) {
        // Not admin
        // Check that the ID in the payload matches the ID in the request
        if (payload.nscc_id.toUpperCase() !== request.params.id.toUpperCase()) { return false; }
    }

    return jwt.verify(token, config.jwt.secret);
};
