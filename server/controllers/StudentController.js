const StudentModel = require('../models/StudentModel');

const {
    createToken,
    verifyToken
} = require('../services/token');

exports.fetchAllStudents = async(request, response) => {
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

    try {
        // Return students and new token
        response.status(200);
        response.header('Authorization', `Bearer ${token}`);
        response.header('token', token);
        response.send({ students: await StudentModel.fetchAllStudents() });
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

exports.fetchStudent = async(request, response) => {
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
        admin: verifyToken(request).admin
    });

    try {
        // Return students and new token
        response.status(200);
        response.header('Authorization', `Bearer ${token}`);
        response.header('token', token);
        response.send({ student: await StudentModel.fetchStudent(request) });
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
