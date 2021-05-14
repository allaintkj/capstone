const path = require('path');

const Database = require(path.resolve(__dirname, '../services/Database'));
const Utilities = require(path.resolve(__dirname, '../services/Utilities'));

module.exports = function(app) {
    app.get('/api/:type/get/:id', (req, res) => {
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

        if (req.params.id !== 'all') {
            // students can only request their own ID
            if ((utils.payload.nscc_id !== req.params.id) && (utils.payload.type !== 'faculty')) {
                utils.respond(res, 401, {text: 'You are not authorized to access that resource'});

                return;
            }
        } else if (decoded.type !== 'faculty') {
            utils.respond(res, 401, {text: 'You are not authorized to access that resource'});

            return;
        }

        try {
            // sanitize and assign
            req.params.nscc_id = req.sanitize(req.params.id);
            req.params.type = req.sanitize(req.params.type);
        } catch (exception) {
            utils.respond(res, 500, {text: 'Internal error assigning variables'});
            utils.serverLog(exception);

            return;
        }

        let database = new Database();
        let statement = `SELECT * FROM ${req.params.type};`;
        let params = [];

        if (req.params.nscc_id !== 'all') {
            statement = `SELECT * FROM ${req.params.type} WHERE nscc_id = ? ORDER BY last_name;`;
            params = [req.params.nscc_id];
        }

        database.query(statement, params).then(rows => {
            if (!rows) { return; }

            if (rows.length < 1) {
                // no results
                utils.respond(res, 200, {users: []});
                database.close();

                return;
            }

            if ((req.params.nscc_id !== 'all') && rows[1]) {
                // duplicate users
                utils.respond(res, 401, {text: 'Duplicate user found'});
                database.close();

                return;
            }

            if (req.params.nscc_id !== 'all') {
                let user = rows[0];
                user.comment = user.comment ? user.comment : '';

                if (user.start_date) { user.start_date = utils.date(new Date(user.start_date)); }
                if (user.end_date) { user.end_date = utils.date(new Date(user.end_date)); }

                delete user.password;
                delete user.password_reset_req;
                delete user.salt;

                utils.respond(res, 200, {users: user});
                database.close();
            } else {
                let users = [];

                rows.forEach(user => {
                    if (user.nscc_id !== 'W0000001') {
                        user.comment = user.comment ? user.comment : '';

                        if (user.start_date) { user.start_date = utils.date(new Date(user.start_date)); }
                        if (user.end_date) { user.end_date = utils.date(new Date(user.end_date)); }

                        delete user.password;
                        delete user.password_reset_req;
                        delete user.salt;

                        users.push(user);
                    }
                });

                utils.respond(res, 200, {users: users});
                database.close();
            }
        }).catch(error => {
            utils.respond(res, 500, {text: 'Internal error querying database'});
            utils.serverLog(error);
            database.close();
        });
    });
};
