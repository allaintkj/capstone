const path = require('path');
const validate = require('validate.js');

const regExp = require(path.resolve(__dirname, '../config.regexp.json'));

const Database = require(path.resolve(__dirname, '../services/Database'));
const Utilities = require(path.resolve(__dirname, '../services/Utilities'));

module.exports = function(app) {
    app.post('/api/:type/update', (req, res) => {
        let abcRegExp = RegExp(regExp.alphabetical);
        let dateRegExp = RegExp(regExp.date);
        let utils = new Utilities();

        // validation constraints
        const facultyConstraints = {
            first_name: {
                format: {
                    pattern: abcRegExp,
                    message: 'Not a valid name (a-z, A-Z, 0-9, hyphens)'
                },
                length: {
                    maximum: 50,
                    minimum: 3,
                    tooLong: 'Maximum 50 characters',
                    tooShort: 'Minimum 8 characters'
                },
                presence: {message: 'Must not be empty'}
            },
            last_name: {
                format: {
                    pattern: abcRegExp,
                    message: 'Not a valid name (a-z, A-Z, 0-9, hyphens)'
                },
                length: {
                    maximum: 50,
                    minimum: 3,
                    tooLong: 'Maximum 50 characters',
                    tooShort: 'Minimum 8 characters'
                },
                presence: {message: 'Must not be empty'}
            }
        };

        const studentConstraints = {
            advisor: {
                format: {
                    pattern: abcRegExp,
                    message: 'Not a valid name (a-z, A-Z, 0-9, hyphens)'
                },
                length: {
                    maximum: 50,
                    minimum: 3,
                    tooLong: 'Maximum 50 characters',
                    tooShort: 'Minimum 3 characters'
                },
                presence: {message: 'Must not be empty'}
            },
            first_name: {
                format: {
                    pattern: abcRegExp,
                    message: 'Not a valid name (a-z, A-Z, 0-9, hyphens)'
                },
                length: {
                    maximum: 50,
                    minimum: 3,
                    tooLong: 'Maximum 50 characters',
                    tooShort: 'Minimum 3 characters'
                },
                presence: {message: 'Must not be empty'}
            },
            last_name: {
                format: {
                    pattern: abcRegExp,
                    message: 'Not a valid name (a-z, A-Z, 0-9, hyphens)'
                },
                length: {
                    maximum: 50,
                    minimum: 3,
                    tooLong: 'Maximum 50 characters',
                    tooShort: 'Minimum 3 characters'
                },
                presence: {message: 'Must not be empty'}
            },
            start_date: {
                format: {
                    pattern: dateRegExp,
                    message: 'Not correct format'
                },
                presence: {message: 'Must not be empty'}
            },
            end_date: {
                format: {
                    pattern: dateRegExp,
                    message: 'Not correct format'
                },
                presence: {message: 'Must not be empty'}
            }
        };

        // attempt to verify token
        let decoded = utils.verifyToken(req);

        if (!decoded) {
            // verification failure
            utils.respond(res, 401, {text: utils.messages});
            utils.serverLog('Invalid token');

            return;
        }

        utils.payload = {
            // set payload for refreshing the token
            nscc_id: decoded.nscc_id,
            type: decoded.type
        };

        if (utils.payload.type !== 'faculty') {
            // valid token, but user is not faculty
            utils.respond(res, 401, {text: 'You are not authorized to access that resource'});
            utils.serverLog('Valid token but user is unauthorized');

            return;
        }

        try {
            req.params.type = req.sanitize(req.params.type.toLowerCase());
        } catch (exception) {
            utils.respond(res, 500, {text: 'Invalid user type'});
            utils.serverLog(exception);

            return;
        }

        validate.options = {fullMessages: false};
        let constraints = req.params.type === 'student' ? studentConstraints : facultyConstraints;
        let errors = validate(req.body, constraints);

        if (errors) {
            utils.respond(res, 400, {validation: errors});

            return;
        }

        // try sanitizing
        if (req.params.type === 'student') {
            try {
                req.body.active = req.body.active ? req.sanitize(req.body.active) : 0;
                req.body.advisor = req.sanitize(req.body.advisor);
                req.body.comment = req.body.comment ? req.sanitize(req.body.comment) : '';
                req.body.end_date = utils.date(new Date(req.sanitize(req.body.end_date)));
                req.body.first_name = req.sanitize(req.body.first_name);
                req.body.last_name = req.sanitize(req.body.last_name);
                req.body.nscc_id = req.sanitize(req.body.nscc_id).toUpperCase();
                req.body.start_date = utils.date(new Date(req.sanitize(req.body.start_date)));

                if (req.body.password_reset_req && (req.body.password_reset_req == true)) { req.body.password_reset_req = 1; }
            } catch (exception) {
                utils.respond(res, 500, {text: 'Internal error assigning variables'});
                utils.serverLog(exception);

                return;
            }
        } else {
            try {
                req.body.active = req.body.active ? req.sanitize(req.body.active) : 0;
                req.body.comment = req.body.comment ? req.sanitize(req.body.comment) : '';
                req.body.first_name = req.sanitize(req.body.first_name);
                req.body.last_name = req.sanitize(req.body.last_name);
                req.body.nscc_id = req.sanitize(req.body.nscc_id).toUpperCase();

                if (req.body.password_reset_req && (req.body.password_reset_req == true)) { req.body.password_reset_req = 1; }
            } catch (exception) {
                utils.respond(res, 500, {text: 'Internal error assigning variables'});
                utils.serverLog(exception);

                return;
            }
        }

        // connect to database and insert user
        let database = new Database();

        let facultyColumns = 'active = ?, comment = ?, first_name = ?, last_name = ?, nscc_id = ?';
        let studentColumns = 'active = ?, advisor = ?, comment = ?, end_date = ?, first_name = ?, last_name = ?, nscc_id = ?, start_date = ?';
        let columns = req.params.type === 'student' ? studentColumns : facultyColumns;
        columns += req.body.password_reset_req ? ', password_reset_req = ?' : '';

        let facultyParams = [
            parseInt(req.body.active, 10),
            req.body.comment,
            req.body.first_name,
            req.body.last_name,
            req.body.nscc_id,
            // where
            req.body.nscc_id
        ];
        let studentParams = [
            req.body.active,
            req.body.advisor,
            req.body.comment,
            req.body.end_date,
            req.body.first_name,
            req.body.last_name,
            req.body.nscc_id,
            req.body.start_date,
            // where
            req.body.nscc_id
        ];

        let statement = `UPDATE ${req.params.type} SET ${columns} WHERE nscc_id = ?;`;
        let params = req.params.type === 'student' ? studentParams : facultyParams;

        if (req.body.password_reset_req === 1) {
            let userId = params.pop();

            params.push(1);
            params.push(userId);
        }

        database.query(statement, params).then(rows => {
            if (rows) {
                if (rows.affectedRows < 1) {
                    utils.respond(res, 500, {text: 'Could not update user'});
                    database.close();

                    return;
                }

                utils.respond(res, 200, {text: 'User updated successfully'});
                database.close();

                return;
            }
        });
    });
};
