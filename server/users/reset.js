const crypto = require('crypto');
const path = require('path');
const validate = require('validate.js');

const regExp = require(path.resolve(__dirname, '../config.regexp.json'));

const Utilities = require(path.resolve(__dirname, '../services/Utilities'));
const Database = require(path.resolve(__dirname, '../services/Database'));

module.exports = function(app) {
    app.post('/api/password/reset', (req, res) => {
        let utils = new Utilities();
        // attempt to verify token
        let decoded = utils.verifyToken(req);
        let pwRegExp = RegExp(regExp.password);

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

        if (req.body.password !== req.body.passwordConfirm) {
            utils.respond(res, 400, {validation: {passwordConfirm: 'Passwords do not match'}});

            return;
        }

        try {
            req.body.password = req.sanitize(req.body.password);
            req.body.passwordConfirm = req.sanitize(req.body.passwordConfirm);
        } catch (exception) {
            utils.respond(res, 500, {text: 'Internal error assigning variables'});
            utils.serverLog(exception);

            return;
        }

        const constraints = {
            password: {
                format: {
                    pattern: pwRegExp,
                    message: 'Not a valid password (a-z, A-Z, at least one digit)'
                },
                length: {
                    maximum: 50,
                    minimum: 8,
                    tooLong: 'Maximum 50 characters',
                    tooShort: 'Minimum 8 characters'
                },
                presence: {message: 'Must not be empty'}
            },
            passwordConfirm: {
                format: {
                    pattern: pwRegExp,
                    message: 'Not a valid password (a-z, A-Z, at least one digit)'
                },
                length: {
                    maximum: 50,
                    minimum: 8,
                    tooLong: 'Maximum 50 characters',
                    tooShort: 'Minimum 8 characters'
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

        let database = new Database();
        let statement = `SELECT password_reset_req FROM ${utils.payload.type} WHERE nscc_id = ?;`;
        let params = [utils.payload.nscc_id];

        database.query(statement, params).then(rows => {
            // pull the user and check password reset flag
            if (rows.length < 1) {
                // no results
                utils.respond(res, 400, {validation: {nscc_id: 'Could not find that ID'}});
                database.close();

                return;
            }

            if (rows[1]) {
                // more than one result (id should be unique)
                utils.respond(res, 400, {validation: {nscc_id: 'Duplicate user found'}});
                database.close();

                return;
            }

            if (parseInt(rows[0].password_reset_req, 10) === 1) { return true; }

            return false;
        }).then(resetPassword => {
            if (!resetPassword) {
                utils.respond(res, 400, {text: 'Password reset is not required for this account'});
                database.close();

                return;
            }

            // salt and hash the password
            let hash;
            let salt = crypto.randomBytes(32).toString('hex');

            try {
                hash = crypto.pbkdf2Sync(req.body.password, salt, 1000, 64, 'sha512').toString('hex');
            } catch (exception) {
                // issue hashing with crypto module
                utils.respond(res, 500, {text: 'Internal error assigning variables'});
                utils.serverLog(exception);
                database.close();

                return;
            }

            // setup update query
            let col_string = 'salt = ?, password = ?, password_reset_req = ?';
            statement = `UPDATE ${utils.payload.type} SET ${col_string} WHERE nscc_id = ?;`;
            params = [
                salt,
                hash,
                0,
                utils.payload.nscc_id
            ];

            return database.query(statement, params);
        }).then(rows => {
            if (!rows) { throw 'Database did not acknowledge password reset'; }

            utils.respond(res, 200, {text: 'Password updated successfully'});
            database.close();
        }).catch(error => {
            utils.respond(res, 500, {text: 'Internal error querying database'});
            utils.serverLog(JSON.stringify(error));
            database.close();
        });
    });
};
