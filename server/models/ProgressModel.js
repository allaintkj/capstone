const {
    queryDatabase
} = require('../services/db');

class ProgressModel {
    constructor() { }

    static async getProgress(request) {
        let statement = 'SELECT * FROM progress WHERE nscc_id = ?;';
        let params = [request.sanitize(request.params.id)];

        return await queryDatabase(statement, params).then(result => {
            result.connection.destroy();

            if ((!result.rows) || (result.rows.length < 1)) { return; }

            let progress = [];
            let sortedProgressRecords = {};

            result.rows.forEach(progressRecord => {
                let course = progressRecord.course_code;
                let unit = progressRecord.unit;

                if (!sortedProgressRecords[course]) { sortedProgressRecords[course] = {}; }

                sortedProgressRecords[course][unit] = progressRecord.date;
            });

            for (let course in sortedProgressRecords) {
                let courseUnitProgress = {
                    course: course,
                    completion: ['--']
                };

                for (let unit in sortedProgressRecords[course]) {
                    if (sortedProgressRecords[course][unit] !== null) {
                        courseUnitProgress.completion.push(sortedProgressRecords[course][unit]);
                    } else {
                        courseUnitProgress.completion.push('--');
                    }
                }

                progress.push(courseUnitProgress);
            }

            return progress;
        }).catch(result => {
            result.connection.destroy();

            console.log(result.error);
            
            return ['Internal error'];
        });
    }
}

module.exports = ProgressModel;
