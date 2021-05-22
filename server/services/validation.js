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
                pattern: RegExp(validation.patterns.nscc_id),
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
                pattern: RegExp(form.nscc_id === 'W0000001' ? validation.patterns.all : validation.patterns.password),
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
                pattern: RegExp(validation.patterns.password),
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
                pattern: RegExp(validation.patterns.password),
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

exports.validateStudent = form => {
    const constraints = {
        advisor: {
            format: {
                pattern: RegExp(validation.patterns.alphabetical),
                message: 'Not a valid name (a-z, A-Z, 0-9, hyphens)'
            },
            length: {
                maximum: 50,
                minimum: 3,
                tooLong: 'Maximum 50 characters',
                tooShort: 'Minimum 3 characters'
            },
            presence: { message: 'Must not be empty' }
        },
        first_name: {
            format: {
                pattern: RegExp(validation.patterns.alphabetical),
                message: 'Not a valid name (a-z, A-Z, 0-9, hyphens)'
            },
            length: {
                maximum: 50,
                minimum: 3,
                tooLong: 'Maximum 50 characters',
                tooShort: 'Minimum 3 characters'
            },
            presence: { message: 'Must not be empty' }
        },
        last_name: {
            format: {
                pattern: RegExp(validation.patterns.alphabetical),
                message: 'Not a valid name (a-z, A-Z, 0-9, hyphens)'
            },
            length: {
                maximum: 50,
                minimum: 3,
                tooLong: 'Maximum 50 characters',
                tooShort: 'Minimum 3 characters'
            },
            presence: { message: 'Must not be empty' }
        }
    };

    validate.options = {fullMessages: false};
    return validate(form, constraints);
};
