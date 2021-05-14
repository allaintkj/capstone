const path = require('path');

const Database = require(path.resolve(__dirname, '../services/Database'));
const Utilities = require(path.resolve(__dirname, '../services/Utilities'));

module.exports = function(app) {
    app.get('/api/progress/:id', (req, res) => {
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

        let database = new Database();
        let statement = 'SELECT * FROM course';
        let params = [];
        let progress = [];
        let courses = [];

        // query for all courses first
        database.query(statement, params).then(rows => {
            if (!rows || !rows[0]) {
                utils.respond(res, 200, {progress: []});
                database.close();

                return;
            }

            // save results
            courses = rows;
            // now get all progress for this user
            statement = 'SELECT * FROM progress WHERE nscc_id = ?';
            params = [req.params.nscc_id];

            // execute query
            return database.query(statement, params);
        }).then(rows => {
            if (!rows) { return; }

            // iterate courses, filter student's progress by course code
            courses.forEach(course => {
                // create the entry for this code
                let rowsThisCode = rows.filter(row => row.course_code === course.course_code);
                let codeProgressEntry = {
                    comments: '',
                    course: {
                        code: course.course_code,
                        name: course.course_name,
                        units: course.number_units
                    },
                    final: '',
                    units: {}
                };

                if (!rowsThisCode || !rowsThisCode[0]) { return; }

                rowsThisCode.forEach(progressRow => {
                    // comments
                    if (progressRow.unit === 100) {
                        codeProgressEntry.comments = progressRow.comments;

                        return;
                    }

                    // final
                    if (progressRow.unit === 101) {
                        codeProgressEntry.final = progressRow.final;

                        return;
                    }

                    let date = progressRow.date ? utils.date(new Date(progressRow.date)) : '';

                    // build unit object
                    codeProgressEntry.units = {
                        ...codeProgressEntry.units,
                        [progressRow.unit]: date
                    };
                });

                let recordedUnits = Object.keys(codeProgressEntry.units).length;
                let totalUnits = codeProgressEntry.course.units;

                if (recordedUnits < totalUnits) {
                    for (let i = recordedUnits; i <= totalUnits; i++) {
                        codeProgressEntry.units = {
                            ...codeProgressEntry.units,
                            [i]: ''
                        };
                    }
                }

                progress.push(codeProgressEntry);
            });

            utils.respond(res, 200, {progress: progress});
            database.close();
        }).catch(error => {
            utils.respond(res, 500, {text: 'Internal error querying database'});
            utils.serverLog(error);
            database.close();
        });
    });
};
