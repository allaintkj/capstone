const validate = require('validate.js');

const { validation } = require('../config.json');

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

exports.validateCourse = form => {
    const constraints = {
        course_code: {
            format: {
                pattern: RegExp(validation.patterns.course_code),
                message: 'Not a valid course code '
            },
            presence: { message: 'Must not be empty' }
        },
        course_name: {
            format: {
                pattern: RegExp(validation.patterns.alphabetical),
                message: 'Not a valid name (a-z, A-Z, 0-9, hyphens)'
            },
            length: {
                maximum: 100,
                minimum: 10,
                tooLong: 'Maximum 100 characters',
                tooShort: 'Minimum 10 characters'
            },
            presence: { message: 'Must not be empty' }
        },
        course_desc: {
            format: {
                pattern: RegExp(validation.patterns.alphabetical),
                message: 'Not a valid description (a-z, A-Z, 0-9, hyphens)'
            },
            length: {
                maximum: 150,
                minimum: 10,
                tooLong: 'Maximum 150 characters',
                tooShort: 'Minimum 10 characters'
            },
            presence: { message: 'Must not be empty' }
        },
        number_credits: {
            numericality: {
                greaterThan: 0,
                lessThan: 11,
                onlyInteger: true,
                notGreaterThan: 'Must be at least 1',
                notInteger: 'Must be a whole number',
                notLessThan: 'Maximum 10 credits'
            },
            presence: { message: 'Must not be empty' }
        },
        number_units: {
            numericality: {
                greaterThan: 0,
                lessThan: 13,
                onlyInteger: true,
                notGreaterThan: 'Must be at least 1',
                notInteger: 'Must be a whole number',
                notLessThan: 'Maximum 12 units'
            },
            presence: { message: 'Must not be empty' }
        }
    };

    validate.options = {fullMessages: false};
    return validate(form, constraints);
};
