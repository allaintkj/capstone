const path = require('path');

const Database = require(path.resolve(__dirname, '../services/Database'));
const Utilities = require(path.resolve(__dirname, '../services/Utilities'));

module.exports = function(app) {
    app.delete('/api/:type/delete', (req, res) => {
        let utils = new Utilities();
        // verify token
        let decoded = utils.verifyToken(req);

        if (!decoded) {
            // verification failure
            utils.respond(res, 401, {text: utils.messages});
            utils.serverLog('Invalid token');

            return;
        }

        utils.payload = {
            // set payload for token refresh
            nscc_id: decoded.nscc_id,
            type: decoded.type
        };

        if (utils.payload.type !== 'faculty') {
            // valid token, but user is not faculty
            utils.respond(res, 401, {text: 'You are not authorized to access that resource'});
            utils.serverLog('Valid token but user is unauthorized');

            return;
        }

        let database = new Database();
        let statement, params;

        try {
            let type = req.sanitize(req.params.type);
            statement = `DELETE FROM ${type} WHERE nscc_id = ?`;
            params = [req.sanitize(req.body.nscc_id)];
        } catch (exception) {
            utils.respond(res, 500, {text: 'Internal error assigning variables'});
            utils.serverLog(exception);

            return;
        }

        database.query(statement, params).then(rows => {
            if (rows) {
                if (rows.affectedRows < 1) {
                    utils.respond(res, 400, {text: 'Deletion failed, user not found'});
                    database.close();

                    return;
                }

                utils.respond(res, 200, {text: 'User removed successfully'});
                database.close();

                return;
            }
        }).catch(error => {
            utils.respond(res, 500, {text: 'Internal error querying database'});
            utils.serverLog(error);
            database.end();

            return;
        });
    });
};
