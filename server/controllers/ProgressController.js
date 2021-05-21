const ProgressModel = require('../models/ProgressModel');

const {
    createToken,
    verifyToken
} = require('../services/token');

const {
    validateId
} = require('../services/validation');

exports.fetchStudentProgress = async(request, response) => {
    // Validate ID parameter first
    if (!validateId(request.params.id)) {
        response.status(400);
        response.send({ text: 'Invalid ID requested' });
        return;
    }

    // Create new token for the response
    let token = createToken({
        nscc_id: request.params.id,
        admin: true,
        type: 'faculty'
    });

    try {
        // Attempt to verify JWT in authorization header
        if (!verifyToken(request)) {
            response.status(401);
            response.send({ text: 'Invalid token' });
            return;
        }

        // Get all progress records for ID
        let progressModel = new ProgressModel();
        let progress = await progressModel.getProgress(request.sanitize(request.params.id));

        response.status(200);
        response.header('Authorization', `Bearer ${token}`);
        response.header('token', token);
        response.send({ progress });
    } catch (error) {
        console.log(error);

        response.status(500);
        response.header('Authorization', `Bearer ${token}`);
        response.header('token', token);
        response.send({ text: 'Internal error' });
    }
};
