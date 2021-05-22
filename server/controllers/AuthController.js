const AuthModel = require('../models/AuthModel');

const {
    validateLogin,
    validatePasswords
} = require('../services/validation');

const {
    createToken,
    verifyToken
} = require('../services/token');

exports.login = async(request, response) => {
    let token;
    let form = {
        nscc_id: request.body.nscc_id.toUpperCase(),
        password: request.body.password
    };

    // Returns null if validation passes
    if (validateLogin(form)) {
        // Failed
        // Returns error message object
        response.status(400);
        response.send({ validation: validateLogin(form) });
        return;
    }

    // Check for password reset flag
    let passwordResetCheck = await AuthModel.passwordResetCheck(form);

    if (passwordResetCheck.failed) {
        // Error object will be null if password reset is required
        if (!passwordResetCheck.error) {
            token = createToken({
                nscc_id: form.nscc_id,
                admin: passwordResetCheck.isAdmin,
                password_reset: true
            });

            response.status(300);
            response.header('Authorization', `Bearer ${token}`);
            response.send({ text: 'Password reset required' });
            return;
        }

        response.status(400);
        response.send({ text: passwordResetCheck.error });
        return;
    }

    let loginAttempt = await AuthModel.login(form, passwordResetCheck.isAdmin);

    if (loginAttempt.failed) {
        response.status(401);
        response.send({ text: loginAttempt.error });
        return;
    }

    // Create new token for the response
    token = createToken({
        nscc_id: form.nscc_id,
        admin: passwordResetCheck.isAdmin
    });

    response.status(200);
    response.header('Authorization', `Bearer ${token}`);
    response.send({ text: 'Authenticated successfully' });
};

exports.resetPassword = async(request, response) => {
    // Attempt to verify JWT in authorization header
    if (!verifyToken(request)) {
        response.status(401);
        response.send({ text: 'Invalid token' });
        return;
    }

    let user = {
        nscc_id: verifyToken(request).nscc_id.toUpperCase(),
        password: request.body.password,
        passwordConfirm: request.body.passwordConfirm,
        admin: verifyToken(request).admin
    };

    // Token for response
    let token = createToken({
        nscc_id: user.nscc_id,
        admin: user.admin,
        password_reset: true
    });

    // Passwords must match
    if (user.password !== user.passwordConfirm) {
        response.status(400);
        response.header('Authorization', `Bearer ${token}`);
        response.send({ validation: { passwordConfirm: 'Passwords do not match' } });
        return;
    }

    // Returns null if validation passes
    if (validatePasswords(user)) {
        // Failed
        // Returns error message object
        response.status(400);
        response.header('Authorization', `Bearer ${token}`);
        response.send({ validation: validateLogin(user) });
        return;
    }

    let resetAttempt = await AuthModel.resetPassword(user);

    // Execute reset
    if (resetAttempt.failed) {
        response.status(400);
        response.header('Authorization', `Bearer ${token}`);
        response.send({ text: resetAttempt.error });
        return;
    }

    // No longer need reset flag
    token = createToken({
        nscc_id: user.nscc_id,
        admin: user.admin
    });

    response.status(200);
    response.header('Authorization', `Bearer ${token}`);
    response.send({ text: 'Password updated successfully' });
};
