const {
    queryDatabase
} = require('../services/db');

class CourseModel {
    constructor() { }

    static async fetchAllCourses() {
        let statement = 'SELECT * FROM course ORDER BY course_code';

        return await queryDatabase(statement).then(result => {
            result.connection.destroy();

            if ((!result.rows) || (result.rows.length < 1)) { return; }

            return result.rows.map(course => {
                course.comment = course.comment ? course.comment : '';
                return course;
            });
        }).catch(result => {
            result.connection.destroy();
            console.log(result.error);

            return ['Internal error'];
        });
    }

    static async addCourse(form) {
        let statement = 'SELECT * FROM course WHERE course_code = ?';
        let params = [form.course_code];

        return await queryDatabase(statement, params).then(result => {
            result.connection.destroy();

            // Check for pre-existing course
            if (result.rows.length >= 1) {
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
        }).then(result => {
            result.connection.destroy();

            // No result
            if (!result.rows) {
                return {
                    failed: true,
                    error: 'Internal error'
                };
            }

            // Rows have been affected
            // Insert successful
            if (result.rows.affectedRows) {
                return {
                    failed: false,
                    error: null
                };
            }
        }).catch(result => {
            result.connection.destroy();
            console.log(result.error);

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

        return await queryDatabase(statement, params).then(result => {
            /* FIXME: Check progress records and update as necessary if unit numbers change */
            result.connection.destroy();

            if (result.rows) {
                if (result.rows.affectedRows < 1 || result.rows.changedRows < 1) {
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
        }).catch(result => {
            result.connection.destroy();
            console.log(result.error);

            return {
                failed: true,
                error: 'Internal error'
            };
        });
    }

    static async deleteCourse(course_code) {
        let statement = 'DELETE FROM course WHERE course_code = ?';
        let params = [course_code];

        return await queryDatabase(statement, params).then(result => {
            result.connection.destroy();

            // Check result
            if (result.rows) {
                if (result.rows.affectedRows < 1) {
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
        }).catch(result => {
            result.connection.destroy();
            console.log(result.error);

            return {
                failed: true,
                error: 'Internal error'
            };
        });
    }
}

module.exports = CourseModel;
