const path = require('path');
const validate = require('validate.js');

const regExp = require(path.resolve(__dirname, '../config.regexp.json'));

const Database = require(path.resolve(__dirname, '../services/Database'));
const Utilities = require(path.resolve(__dirname, '../services/Utilities'));

module.exports = function(app) {
    app.put('/api/:type/add', (req, res) => {
        let abcRegExp = RegExp(regExp.alphabetical);
        let dateRegExp = RegExp(regExp.date);
        let idRegExp = RegExp(regExp.nscc_id);
        let utils = new Utilities();

        // validation constraints
        const facultyConstraints = {
            nscc_id: {
                format: {
                    pattern: idRegExp,
                    message: 'Not a valid ID'
                },
                length: {
                    maximum: 8,
                    minimum: 8,
                    message: 'Should be exactly 8 characters'
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
            nscc_id: {
                format: {
                    pattern: idRegExp,
                    message: 'Not a valid ID'
                },
                length: {
                    maximum: 8,
                    minimum: 8,
                    message: 'Should be exactly 8 characters'
                },
                presence: {message: 'Must not be empty'}
            },
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
            } catch (exception) {
                utils.respond(res, 500, {text: 'Internal error assigning variables'});
                utils.serverLog(exception);

                return;
            }
        }

        // connect to database and insert user
        let database = new Database();
        let statement = `SELECT nscc_id FROM ${req.params.type} WHERE nscc_id = ?;`;
        let params = [req.body.nscc_id];

        database.query(statement, params).then(rows => {
            if (rows.length >= 1) {
                utils.respond(res, 400, {validation: { nscc_id: 'User already exists in database'}});
                database.close();

                return;
            }

            let facultyColumns = '(`nscc_id`, `first_name`, `last_name`, `comment`, `active`, `password_reset_req`)';
            let studentColumns = '(`nscc_id`, `first_name`, `last_name`, `start_date`, `end_date`, `advisor`, `active`, `comment`, `password_reset_req`)';
            let columns = req.params.type === 'student' ? studentColumns : facultyColumns;

            let facultyPlaceholder = '(?, ?, ?, ?, ?, ?)';
            let studentPlaceholder = '(?, ?, ?, ?, ?, ?, ?, ?, ?)';
            let placeholder = req.params.type === 'student' ? studentPlaceholder : facultyPlaceholder;

            let facultyParams = [
                req.body.nscc_id,
                req.body.first_name,
                req.body.last_name,
                req.body.comment,
                parseInt(req.body.active, 10),
                1
            ];

            let studentParams = [
                req.body.nscc_id,
                req.body.first_name,
                req.body.last_name,
                req.body.start_date,
                req.body.end_date,
                req.body.advisor,
                parseInt(req.body.active, 10),
                req.body.comment,
                1
            ];

            statement = `INSERT INTO ${req.params.type} ${columns} VALUES ${placeholder};`;
            params = req.params.type === 'student' ? studentParams : facultyParams;

            return database.query(statement, params);
        }).then(rows => {
            if (!rows) { return; }

            if (rows.affectedRows) {
                utils.respond(res, 200, {text: 'User added successfully'});
                database.close();
            }
        }).catch(error => {
            utils.respond(res, 401, {text: 'Internal error querying database'});
            utils.serverLog(error);
            database.close();
        });
    });
};
