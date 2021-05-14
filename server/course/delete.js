const path = require('path');

const Database = require(path.resolve(__dirname, '../services/Database'));
const Utilities = require(path.resolve(__dirname, '../services/Utilities'));

module.exports = function(app) {
    app.delete('/api/course/delete', (req, res) => {
        let utils = new Utilities();
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

        // mysql
        let database = new Database();
        let statement = 'DELETE FROM course WHERE course_code = ?';
        let params = [req.sanitize(req.body.course_code)];

        database.query(statement, params).then(rows => {
            if (rows) {
                if (rows.affectedRows < 1) {
                    utils.respond(res, 400, {text: 'Deletion failed: course not found'});
                    utils.serverLog(rows);
                    database.close();

                    return;
                }

                utils.respond(res, 200, {text: 'Course removed successfully'});
                database.close();
            }
        }).catch(error => {
            utils.respond(res, 500, {text: 'Internal error querying database'});
            utils.serverLog(error);
            database.close();
        });
    });
};
