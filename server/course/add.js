const path = require('path');
const validate = require('validate.js');

const regExp = require(path.resolve(__dirname, '../config.regexp.json'));

const Database = require(path.resolve(__dirname, '../services/Database'));
const Utilities = require(path.resolve(__dirname, '../services/Utilities'));

module.exports = function(app) {
    app.put('/api/course/add', (req, res) => {
        let utils = new Utilities();
        let abcRegExp = RegExp(regExp.alphabetical);
        let codeRegExp = RegExp(regExp.course_code);
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

        // some validation
        const constraints = {
            course_code: {
                format: {
                    pattern: codeRegExp,
                    message: 'Not a valid course code'
                },
                presence: {message: 'Must not be empty'}
            },
            course_name: {
                format: {
                    pattern: abcRegExp,
                    message: 'Not a valid name (a-z, A-Z, 0-9, hyphens)'
                },
                length: {
                    maximum: 100,
                    minimum: 10,
                    tooLong: 'Maximum 100 characters',
                    tooShort: 'Minimum 10 characters'
                },
                presence: {message: 'Must not be empty'}
            },
            course_desc: {
                format: {
                    pattern: abcRegExp,
                    message: 'Not a valid description (a-z, A-Z, 0-9, hyphens)'
                },
                length: {
                    maximum: 150,
                    minimum: 10,
                    tooLong: 'Maximum 150 characters',
                    tooShort: 'Minimum 10 characters'
                },
                presence: {message: 'Must not be empty'}
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
                presence: {message: 'Must not be empty'}
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
                presence: {message: 'Must not be empty'}
            }
        };

        validate.options = {fullMessages: false};
        let errors = validate(req.body, constraints);

        if (errors) {
            utils.respond(res, 400, {validation: errors});

            return;
        }

        try {
            // validation passed, try sanitizing
            req.body.comment = req.sanitize(req.body.comment);
            req.body.course_code = req.sanitize(req.body.course_code).toUpperCase();
            req.body.course_desc = req.sanitize(req.body.course_desc);
            req.body.course_name = req.sanitize(req.body.course_name);
            req.body.number_credits = req.sanitize(req.body.number_credits);
            req.body.number_units = req.sanitize(req.body.number_units);
        } catch (exception) {
            utils.respond(res, 500, {text: 'Internal error assigning variables'});
            utils.serverLog(exception);

            return;
        }

        // connect to database and insert course
        let database = new Database();
        let statement = 'SELECT * FROM course WHERE course_code = ?';
        let params = [req.sanitize(req.body.course_code)];

        database.query(statement, params).then(rows => {
            if (rows.length >= 1) {
                utils.respond(res, 400, {validation: {course_code: 'A course with that code already exists'}});
                database.close();

                return;
            }

            let columns = '(`comment`, `course_code`, `course_desc`, `course_name`, `number_credits`, `number_units`)';
            let placeholder = '(?, ?, ?, ?, ?, ?)';
            statement = `INSERT INTO course ${columns} VALUES ${placeholder};`;
            params = [
                req.body.comment,
                req.body.course_code,
                req.body.course_desc,
                req.body.course_name,
                req.body.number_credits,
                req.body.number_units
            ];

            return database.query(statement, params);
        }).then(rows => {
            if (rows) {
                utils.respond(res, 200, {text: 'Course added successfully'});
            }

            database.close();
        }).catch(error => {
            utils.respond(res, 500, {text: 'Internal error querying database for course'});
            utils.serverLog(error);
            database.close();
        });
    });
};

