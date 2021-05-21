const {
    queryDatabase,
    closeDatabase
} = require('../services/db');

class CourseModel {
    constructor() { }

    static async fetchAllCourses() {
        let statement = 'SELECT * FROM course ORDER BY course_code';

        return await queryDatabase(statement).then(courses => {
            closeDatabase();
            
            if ((!courses) || (courses.length < 1)) { return; }

            return courses.map(course => {
                course.comment = course.comment ? course.comment : '';
                return course;
            });
        }).catch(() => {
            closeDatabase();
            return ['Internal error'];
        });
    }
}

module.exports = CourseModel;
