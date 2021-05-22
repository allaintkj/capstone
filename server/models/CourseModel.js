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
        }).catch(error => {
            console.log(error);

            closeDatabase();
            
            return ['Internal error'];
        });
    }

    static async addCourse(form) {
        let statement = 'SELECT * FROM course WHERE course_code = ?';
        let params = [form.course_code];

        return await queryDatabase(statement, params).then(rows => {
            closeDatabase();

            // Check for pre-existing course
            if (rows.length >= 1) {
                // Already exists
                return {
                    failed: true,
                    error: 'Course already exists'
                };
            }

            // Course does not exist
            // Prepare insert statement
            let columns = '(`comment`, `course_code`, `course_desc`, `course_name`, `number_credits`, `number_units`)';
            statement = `INSERT INTO course ${columns} VALUES (?, ?, ?, ?, ?, ?);`;
            params = [
                form.comment,
                form.course_code,
                form.course_desc,
                form.course_name,
                form.number_credits,
                form.number_units
            ];

            return queryDatabase(statement, params);
        }).then(rows => {
            closeDatabase();

            // No result
            if (!rows) {
                return {
                    failed: true,
                    error: 'Internal error'
                };
            }

            // Rows have been affected
            // Insert successful
            if (rows.affectedRows) {
                return {
                    failed: false,
                    error: null
                };
            }
        }).catch(error => {
            console.log(error);

            closeDatabase();

            return {
                failed: true,
                error: 'Internal error'
            };
        });
    }

    static async updateCourse(form) {
        let columns = 'comment = ?, course_code = ?, course_desc = ?, course_name = ?, number_credits = ?, number_units = ?';
        let statement = 'UPDATE course SET ' + columns + ' WHERE course_code = ?';
        let params = [
            form.comment,
            form.course_code,
            form.course_desc,
            form.course_name,
            form.number_credits,
            form.number_units,
            form.course_code
        ];

        return await queryDatabase(statement, params).then(rows => {
            closeDatabase();

            /* FIXME: Check progress records and update as necessary if unit numbers change */

            if (rows) {
                if (rows.affectedRows < 1 || rows.changedRows < 1) {
                    return {
                        failed: true,
                        error: 'Could not update course'
                    };
                }

                return {
                    failed: false,
                    error: null
                };
            }
        }).catch(error => {
            console.log(error);

            closeDatabase();

            return {
                failed: true,
                error: 'Internal error'
            };
        });
    }

    static async deleteCourse(course_code) {
        let statement = 'DELETE FROM course WHERE course_code = ?';
        let params = [course_code];

        return await queryDatabase(statement, params).then(rows => {
            // Check result
            if (rows) {
                if (rows.affectedRows < 1) {
                    // No affected rows means nothing happened
                    return {
                        failed: true,
                        error: 'Course not found'
                    };
                }

                // Successful delete
                return {
                    failed: false,
                    error: null
                };
            }
        }).catch(error => {
            console.log(error);

            closeDatabase();

            return {
                failed: true,
                error: 'Internal error'
            };
        });
    }
}

module.exports = CourseModel;
