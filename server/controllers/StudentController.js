const StudentModel = require('../models/StudentModel');

const {
    validateStudent
} = require('../services/validation');

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
        response.send({ student: await StudentModel.fetchStudent(request) });
    } catch (error) {
        console.log(error);

        // Exception
        // Return new token with generic message
        response.status(500);
        response.header('Authorization', `Bearer ${token}`);
        response.send({ text: 'Internal error' });
    }
};

exports.updateStudent = async(request, response) => {
    const updating = request.url === '/update';
    let attempt;

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
        // Must be admin if verification passed
        admin: true
    });

    // Sanitize form
    let form = {
        active: parseInt(request.body.active ? request.sanitize(request.body.active) : 0, 10),
        advisor: request.sanitize(request.body.advisor),
        comment: request.body.comment ? request.sanitize(request.body.comment) : '',
        end_date: parseInt(request.sanitize(request.body.end_date), 10),
        first_name: request.sanitize(request.body.first_name),
        last_name: request.sanitize(request.body.last_name),
        nscc_id: request.sanitize(request.body.nscc_id).toUpperCase(),
        start_date: parseInt(request.sanitize(request.body.start_date), 10),
        password_reset_req: parseInt(request.body.password_reset_req ? request.sanitize(request.body.password_reset_req) : 0, 10)
    };

    // Returns null if validation passes
    if (validateStudent(form)) {
        // Failed
        // Returns error message object
        response.status(400);
        response.header('Authorization', `Bearer ${token}`);
        response.send({ validation: validateStudent(form) });
        return;
    }

    if (updating) { attempt = await StudentModel.updateStudent(form); }
    if (!updating) { attempt = await StudentModel.addStudent(form); }

    if (attempt.failed) {
        response.status(500);
        response.header('Authorization', `Bearer ${token}`);
        response.send({ text: attempt.error });
        return;
    }

    response.status(200);
    response.header('Authorization', `Bearer ${token}`);
    response.send({ text: `User ${updating ? 'updated' : 'added'} successfully` });
};
