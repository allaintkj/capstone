const CourseModel = require('../models/CourseModel');

const {
    validateCourse
} = require('../services/validation');

const {
    createToken,
    verifyToken
} = require('../services/token');

exports.fetchAllCourses = async(request, response) => {
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
        // Return courses and new token
        response.status(200);
        response.header('Authorization', `Bearer ${token}`);
        response.send({ courses: await CourseModel.fetchAllCourses() });
    } catch (error) {
        console.log(error);

        // Exception
        // Return new token with generic message
        response.status(500);
        response.header('Authorization', `Bearer ${token}`);
        response.send({ text: 'Internal error' });
    }
};

exports.updateCourse = async(request, response) => {
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
        admin: true
    });

    // Sanitize
    let form = {
        comment: request.sanitize(request.body.comment),
        course_code: request.sanitize(request.body.course_code).toUpperCase(),
        course_desc: request.sanitize(request.body.course_desc),
        course_name: request.sanitize(request.body.course_name),
        number_credits: request.sanitize(request.body.number_credits),
        number_units: request.sanitize(request.body.number_units)
    };

    // Returns null if validation passes
    if (validateCourse(form)) {
        // Failed
        // Returns error message object
        response.status(400);
        response.header('Authorization', `Bearer ${token}`);
        response.send({ validation: validateCourse(form) });
        return;
    }

    if (updating) { attempt = await CourseModel.updateCourse(form); }
    if (!updating) { attempt = await CourseModel.addCourse(form); }

    if (attempt.failed) {
        response.status(500);
        response.header('Authorization', `Bearer ${token}`);
        response.send({ text: attempt.error });
        return;
    }

    response.status(200);
    response.header('Authorization', `Bearer ${token}`);
    response.send({ text: `Course ${updating ? 'update' : 'added'} successfully` });
};

exports.deleteCourse = async(request, response) => {
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

    let attempt = await CourseModel.deleteCourse(request.params.id);

    if (attempt.failed) {
        response.status(500);
        response.header('Authorization', `Bearer ${token}`);
        response.send({ text: attempt.error });
        return;
    }

    response.status(200);
    response.header('Authorization', `Bearer ${token}`);
    response.send({ text: 'Course deleted successfully' });
};
