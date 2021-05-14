const path = require('path');

const Database = require(path.resolve(__dirname, '../services/Database'));
const Utilities = require(path.resolve(__dirname, '../services/Utilities'));

module.exports = function(app) {
    app.get('/api/course/get/all', (req, res) => {
        let utils = new Utilities();
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

        let database = new Database();
        let statement = 'SELECT * FROM course ORDER BY course_name';
        let params = [];

        database.query(statement, params).then(rows => {
            let courseArray = rows.map(course => {
                course.comment = course.comment ? course.comment : '';

                return course;
            });

            utils.respond(res, 200, '', {courses: courseArray});
            database.close();
        }).catch(error => {
            utils.respond(res, 500, {text: 'Internal error querying database for courses'});
            utils.serverLog(error);
            database.close();
        });
    });
};
