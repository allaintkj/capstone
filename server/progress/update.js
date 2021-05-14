const path = require('path');
const validate = require('validate.js');

const regExp = require(path.resolve(__dirname, '../config.regexp.json'));

const Database = require(path.resolve(__dirname, '../services/Database'));
const Utilities = require(path.resolve(__dirname, '../services/Utilities'));

module.exports = function(app) {
    app.post('/api/progress/:id', (req, res) => {
        let utils = new Utilities();
        // verify token
        let decoded = utils.verifyToken(req);

        if (!decoded) {
            // verification failure
            utils.respond(res, 401, {text: utils.messages});

            return;
        }

        utils.payload = {
            // set payload for token refresh
            nscc_id: decoded.nscc_id,
            type: decoded.type
        };

        try {
            req.params.nscc_id = req.sanitize(req.params.id);
        } catch (exception) {
            utils.respond(res, 400, {text: 'Invalid user ID'});

            return;
        }

        if (utils.payload.nscc_id !== req.params.nscc_id) {
            if (utils.payload.type !== 'faculty') {
                // valid token, but user is not faculty or target user
                utils.respond(res, 401, {text: 'You are not authorized to access that resource'});

                return;
            }
        }

        // validate (most of) the chart
        let abcRegExp = RegExp(regExp.alphabetical);
        let codeRegExp = RegExp(regExp.course_code);
        let dateRegExp = RegExp(regExp.date);
        let progress = req.body.progress;

        for (let i = 0; i < progress.length; i++) {
            // validate course
            let constraints = {
                code: {
                    format: {
                        pattern: codeRegExp,
                        message: 'Not a valid course code'
                    },
                    presence: {message: 'Must not be empty'}
                },
                name: {
                    format: {
                        pattern: abcRegExp,
                        message: 'Not a valid course name (a-z, A-Z, 0-9, hyphens)'
                    },
                    length: {
                        maximum: 100,
                        minimum: 10,
                        tooLong: 'Maximum 100 characters',
                        tooShort: 'Minimum 10 characters'
                    },
                    presence: {message: 'Must not be empty'}
                }
            };

            validate.options = {fullMessages: false};
            let errors = validate(progress[i].course, constraints);

            if (errors) {
                utils.respond(res, 400, {validation: errors});

                return;
            }

            if (progress[i].comments || progress[i].final) {
                // validate final and comments
                errors = null;
                constraints = {
                    comments: {
                        format: {
                            pattern: abcRegExp,
                            message: 'Comment contains invalid characters (a-z, A-Z, 0-9, hyphens)'
                        }
                    },
                    final: {
                        numericality: {
                            greaterThan: -1,
                            lessThan: 101,
                            onlyInteger: true,
                            notGreaterThan: 'Must be a positive number',
                            notInteger: 'Must be a whole number',
                            notLessThan: 'Maximum final mark is 100'
                        }
                    }
                };

                validate.options = {fullMessages: false};
                errors = validate(progress[i].course, constraints);

                if (errors) {
                    utils.respond(res, 400, {validation: errors});

                    return;
                }
            }
        }

        // construct database rows from progress object
        let newRows = [];
        let returned = false;

        req.body.progress.forEach(progressEntry => {
            if (returned) { return; }

            // each entry is a unique course
            let comments, date, final;
            let courseCode = progressEntry.course.code;
            let courseUnits = progressEntry.course.units;
            let userId = req.params.nscc_id;

            for (let unitNumber in progressEntry.units) {
                // insert null unit dates to indicate a student is
                // enrolled, even if they haven't completed a unit yet
                date = progressEntry.units[unitNumber] ? progressEntry.units[unitNumber] : null;

                if (date && !dateRegExp.test(date)) {
                    returned = true;

                    utils.respond(res, 400, {validation: {[courseCode]: 'Invalid date'}});

                    return;
                }

                // newRows.push(`${userId} ${courseCode} ${courseUnits} ${unitNumber} ${date} ${null} ${null}`);
                newRows.push([userId, courseCode, courseUnits, parseInt(unitNumber, 10), date, null, null]);
            }

            if (progressEntry.comments) {
                comments = progressEntry.comments;

                // newRows.push(`${userId} ${courseCode} ${courseUnits} ${100} ${date} ${null} ${comments}`);
                newRows.push([userId, courseCode, courseUnits, 100, date, null, comments]);
            }

            if (progressEntry.final) {
                final = parseInt(progressEntry.final, 10) ? parseInt(progressEntry.final, 10) : null;

                // newRows.push(`${userId} ${courseCode} ${courseUnits} ${101} ${date} ${final} ${null}`);
                newRows.push([userId, courseCode, courseUnits, 101, date, final, null]);
            }
        });

        // heavy-handed; delete all this user's progress, then add it again
        let database = new Database();
        let statement = 'DELETE FROM progress WHERE nscc_id = ?;';
        let params = [req.params.nscc_id];

        database.query(statement, params).then(() => {
            if (req.body.progress.length < 1) {
                utils.respond(res, 200, {text: 'Progress updated successfully'});
                database.close();

                return;
            }

            // run insert regardless of delete result
            let columns = '(nscc_id, course_code, course_units, unit, date, final, comments)';
            params = newRows;
            statement = `INSERT INTO progress ${columns} VALUES ?;`;

            return database.query(statement, [params]);
        }).then(result => {
            if (!result) { return; }

            if (result.affectedRows < 1) {
                utils.respond(res, 500, {text: 'Internal error adding progress'});
                utils.serverLog(result);
                database.close();

                return;
            }

            utils.respond(res, 200, {text: 'Progress updated successfully'});
            database.close();
        }).catch(error => {
            utils.respond(res, 500, {text: 'Internal error updating progress'});
            utils.serverLog(error);
            database.close();
        });
    });
};
