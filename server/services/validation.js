const validate = require('validate.js');

const { validation } = require('../config/config.json');

exports.validateId = nscc_id => {
    let expression = RegExp(validation.patterns.nscc_id);
    return expression.test(nscc_id);
};

exports.validateLogin = form => {
    if (form.nscc_id.toLowerCase() === 'admin') { form.nscc_id = 'W0000001'; }

    const constraints = {
        nscc_id: {
            format: {
                pattern: validation.patterns.nscc_id,
                message: 'Not a valid ID'
            },
            length: {
                maximum: 8,
                minimum: 8,
                message: 'Should be exactly 8 characters'
            },
            presence: { message: 'Must not be empty' }
        },
        password: {
            format: {
                pattern: form.nscc_id === 'W0000001' ? validation.patterns.all : validation.patterns.password,
                message: 'Not a valid password (a-z, A-Z, at least one digit)'
            },
            length: {
                maximum: 50,
                minimum: 8,
                tooLong: 'Maximum 50 characters',
                tooShort: 'Minimum 8 characters'
            },
            presence: { message: 'Must not be empty' }
        }
    };

    validate.options = { fullMessages: false };
    return validate(form, constraints);
};

exports.validatePasswords = form => {
    const constraints = {
        password: {
            format: {
                pattern: validation.patterns.password,
                message: 'Not a valid password (a-z, A-Z, at least one digit)'
            },
            length: {
                maximum: 50,
                minimum: 8,
                tooLong: 'Maximum 50 characters',
                tooShort: 'Minimum 8 characters'
            },
            presence: { message: 'Must not be empty' }
        },
        passwordConfirm: {
            format: {
                pattern: validation.patterns.password,
                message: 'Not a valid password (a-z, A-Z, at least one digit)'
            },
            length: {
                maximum: 50,
                minimum: 8,
                tooLong: 'Maximum 50 characters',
                tooShort: 'Minimum 8 characters'
            },
            presence: { message: 'Must not be empty' }
        }
    };

    validate.options = { fullMessages: false };
    return validate(form, constraints);
};
