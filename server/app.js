const bodyParser = require('body-parser');
const crypto = require('crypto');
const express = require('express');
const sanitizer = require('express-sanitizer');
const validate = require('validate.js');

const path = require('path');

const PORT = process.env.PORT || 5050;
const HOST = process.env.HOST || 'localhost';
const dbConfig = require(path.resolve(__dirname, 'config.db.json'));
const regExp = require(path.resolve(__dirname, 'config.regexp.json'));

const Database = require(path.resolve(__dirname, './services/Database'));
const Utilities = require(path.resolve(__dirname, './services/Utilities'));

const progressRoutes = require('./routes/progressRoutes');

const app = express();

app.use(sanitizer());
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, '../dist')));

/* ---------- PROGRESS ROUTES ---------- */
app.use('/api/progress', progressRoutes);

/* ---------- LOGIN ROUTE ---------- */
app.post('/api/login/:type', (req, res) => {
    let table = req.sanitize(req.params.type.toLowerCase());
    let allRegExp = RegExp(regExp.all);
    let idRegExp = RegExp(regExp.nscc_id);
    let pwRegExp = RegExp(regExp.password);
    let utils = new Utilities();

    // check table exists in config that correlates with type param
    if (!(dbConfig.tables.users.includes(table))) {
        utils.respond(res, 401, {text: 'Invalid user type'});

        return;
    }

    if (!idRegExp.test(req.body.nscc_id) && req.body.nscc_id === 'admin') {
        // user is admin, convert username to proper ID
        req.body.nscc_id = 'W0000001';
        // set table to allow admin to log in from either button on splash screen
        table = 'faculty';
    } else if (!idRegExp.test(req.body.nscc_id)) {
        utils.respond(res, 401, {validation: {nscc_id: 'Not a valid ID'}});

        return;
    }

    try {
        // req sanitization
        req.body.nscc_id = req.sanitize(req.body.nscc_id).toUpperCase();
        req.body.password = req.sanitize(req.body.password);
    } catch (exception) {
        utils.respond(res, 401, {text: 'Internal error assigning variables'});
        utils.serverLog(exception);

        return;
    }

    let database = new Database();
    let statement = `SELECT password_reset_req FROM ${table} WHERE nscc_id = ?;`;
    let params = [req.body.nscc_id];

    database.query(statement, params).then(rows => {
        // pull the user and check password reset flag
        if (rows.length < 1) {
            // no results
            utils.respond(res, 401, {validation: {nscc_id: 'Could not find that ID'}});
            database.close();

            return;
        }

        if (rows[1]) {
            // more than one result (id should be unique)
            utils.respond(res, 401, {validation: {nscc_id: 'Duplicate user found'}});
            database.close();

            return;
        }

        if (parseInt(rows[0].password_reset_req, 10) === 1) { return true; }

        return false;
    }).then(resetPassword => {
        // return for password reset if flag is true
        if (resetPassword) {
            utils.payload = {
                password_reset: true,
                nscc_id: req.body.nscc_id,
                type: table
            };

            utils.respond(res, 300, {text: 'Password reset required'});
            database.close();

            return;
        }

        // flag not true; continue with field validation
        const constraints = {
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
            password: {
                format: {
                    pattern: req.body.nscc_id === 'W0000001' ? allRegExp : pwRegExp,
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
            utils.respond(res, 401, {validation: errors});
            database.close();

            return;
        }

        // now query for password, then hash and verify
        statement = `SELECT password, salt FROM ${table} WHERE nscc_id = ?;`;

        return database.query(statement, params);
    }).then(rows => {
        if (!rows) { return; }

        if (rows.length < 1) {
            // no results
            utils.respond(res, 401, {validation: {nscc_id: 'Could not find that ID'}});
            database.close();

            return;
        }

        if (rows[1]) {
            // duplicate users
            utils.respond(res, 401, {validation: {nscc_id: 'Duplicate user found'}});
            database.close();

            return;
        }

        if (!rows[0].password || !rows[0].salt) {
            utils.payload = {
                password_reset: true,
                nscc_id: req.body.nscc_id,
                type: table
            };

            utils.respond(res, 300, {text: 'Password reset required'});
            database.close();

            return;
        }

        // hash and compare password
        let dbHash = rows[0].password;
        let dbSalt = rows[0].salt;
        let hash;

        try {
            hash = crypto.pbkdf2Sync(req.body.password, dbSalt, 1000, 64, 'sha512').toString('hex');
        } catch (exception) {
            // issue hashing with crypto module
            utils.respond(res, 401, {text: 'Internal error assigning variables'});
            utils.serverLog(exception);
            database.close();

            return;
        }

        if (dbHash != hash) {
            // password doesn't match
            utils.respond(res, 401, {validation: {password: 'Incorrect password'}});
            database.close();

            return;
        }

        // set payload for token
        utils.payload = {
            nscc_id: req.body.nscc_id,
            type: table
        };

        // respond generates token from payload
        utils.respond(res, 200, {text: 'Authenticated successfully'});
        database.close();
    }).catch(error => {
        utils.respond(res, 401, {text: 'Internal error querying database'});
        utils.serverLog(error);
        database.close();
    });
});

/* ---------- COURSE ROUTES ---------- */
require(path.resolve(__dirname, 'course/add'))(app);
require(path.resolve(__dirname, 'course/delete'))(app);
require(path.resolve(__dirname, 'course/get-all'))(app);
require(path.resolve(__dirname, 'course/get-single'))(app);
require(path.resolve(__dirname, 'course/update'))(app);

/* ---------- GENERAL USER ROUTES ---------- */
require(path.resolve(__dirname, 'users/add'))(app);
require(path.resolve(__dirname, 'users/delete'))(app);
require(path.resolve(__dirname, 'users/get'))(app);
require(path.resolve(__dirname, 'users/reset'))(app);
require(path.resolve(__dirname, 'users/update'))(app);

/* ---------- REACT ROUTES ---------- */
app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../dist/index.html')));

let utils = new Utilities();
app.listen(PORT, HOST, () => utils.serverLog(`HTTP server listening on http://${HOST}:${PORT}`));
