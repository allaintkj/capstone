const path = require('path');

const Database = require(path.resolve(__dirname, '../services/Database'));
const Utilities = require(path.resolve(__dirname, '../services/Utilities'));

module.exports = function(app) {
    app.get('/api/course/get/:id', (req, res) => {
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

        try {
            // sanitize and assign
            req.params = req.sanitize(req.params.id);
        } catch (exception) {
            utils.respond(res, 500, {text: 'Internal error assigning variables'});
            utils.serverLog(exception);
            return;
        }

        let database = new Database();
        let statement = 'SELECT * FROM course WHERE course_code = ? ORDER BY course_name';
        let params = [req.params];

        database.query(statement, params).then(rows => {
            if (!rows[0]) {
                utils.respond(res, 500, {text: 'Course does not exist'});
                database.close();
                return;
            }

            let course = rows.map(course => {
                course.comment = course.comment ? course.comment : '';

                return course;
            });

            utils.respond(res, 200, '', {courses: course[0]});
            database.close();
        }).catch(error => {
            utils.respond(res, 500, {text: 'Internal error querying courses'});
            utils.serverLog(error);
            database.close();
        });
    });
};
