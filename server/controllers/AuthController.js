const AuthModel = require('../models/AuthModel');

const { validateLogin } = require('../services/validation');

const {
    createToken,
    verifyToken
} = require('../services/token');

exports.login = async(request, response) => {
    let form = {
        nscc_id: request.body.nscc_id,
        password: request.body.password
    };

    if (!validateLogin(form)) {
        response.status(401);
        response.send({ validation: validateLogin(form) });
        return;
    }

    // Check for password reset flag
    let passwordResetCheck = AuthModel.passwordResetCheck(form);

    if (passwordResetCheck.failed) {
        if (!passwordResetCheck.error) {
            response.status(300);
            response.send({ text: 'Password reset required' });
            return;
        }

        response.status(400);
        response.send({ text: passwordResetCheck.error });
    }

    let loginAttempt = AuthModel.login(form);

    if (loginAttempt.failed) {
        response.status(401);
        response.send({ text: loginAttempt.error });
        return;
    }

    // Create new token for the response
    let token = createToken({
        nscc_id: verifyToken(request).nscc_id,
        admin: loginAttempt.isAdmin
    });

    response.status(200);
    response.header('Authorization', `Bearer ${token}`);
    response.send({ text: 'Authenticated successfully' });
};
