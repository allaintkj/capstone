const ProgressModel = require('../models/ProgressModel');

const {
    createToken,
    verifyToken
} = require('../services/token');

const {
    validateId
} = require('../services/validation');

exports.fetchStudentProgress = async(request, response) => {
    // Attempt to verify JWT in authorization header
    if (!verifyToken(request)) {
        response.status(401);
        response.send({ text: 'Invalid token' });
        return;
    }

    // Provided token is valid
    // Create new token for the response
    let token = createToken({
        nscc_id: verifyToken(request).nscc_id,
        admin: true
    });

    // Validate ID parameter
    if (!validateId(request.params.id)) {
        // Invalid ID requested
        // Return error and new token
        response.status(400);
        response.header('Authorization', `Bearer ${token}`);
        response.header('token', token);
        response.send({ text: 'Invalid ID requested' });
        return;
    }

    try {
        // Return progress and new token
        response.status(200);
        response.header('Authorization', `Bearer ${token}`);
        response.header('token', token);
        response.send({ progress: await ProgressModel.getProgress(request) });
    } catch (error) {
        console.log(error);

        // Exception
        // Return new token with generic message
        response.status(500);
        response.header('Authorization', `Bearer ${token}`);
        response.header('token', token);
        response.send({ text: 'Internal error' });
    }
};
