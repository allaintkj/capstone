const {
    queryDatabase,
    closeDatabase
} = require('../services/db');

class ProgressModel {
    constructor() {
        this.progress = [];
    }

    async getProgress(nscc_id) {
        let statement = 'SELECT * FROM progress WHERE nscc_id = ?;';
        let params = [nscc_id];

        return await queryDatabase(statement, params).then(rows => {
            if (rows.length < 1) {
                closeDatabase();
                return;
            }

            let sortedProgressRecords = {};

            rows.forEach(progressRecord => {
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

                this.progress.push(courseUnitProgress);
            }

            closeDatabase();
            return this.progress;
        }).catch(() => {
            closeDatabase();
            return ['Internal error'];
        });
    }
}

module.exports = ProgressModel;
