const {
    queryDatabase
} = require('../services/db');

class StudentModel {
    constructor() { }

    static async fetchAllStudents() {
        let statement = 'SELECT * FROM student ORDER BY last_name';

        return await queryDatabase(statement).then(result => {
            result.connection.destroy();

            if ((!result.rows) || (result.rows.length < 1)) { return; }

            return result.rows.map(student => {
                student.comment = student.comment ? student.comment : '';
                student.start_date = student.start_date > 1 ? student.start_date : 0;
                student.end_date = student.end_date > 1 ? student.end_date : 0;

                delete student.password;
                delete student.password_reset_req;
                delete student.salt;

                return student;
            });
        }).catch(result => {
            result.connection.destroy();
            console.log(result.error);
            
            return ['Internal error'];
        });
    }

    static async fetchStudent(request) {
        let statement = 'SELECT * FROM student WHERE nscc_id = ? ORDER BY last_name';
        let params = [request.params.id];

        return await queryDatabase(statement, params).then(result => {
            result.connection.destroy();

            // Only a single result should be returned
            // Otherwise we've introduced a duplicate user somehow
            if ((!result.rows) || (result.rows.length !== 1)) { return; }

            let student = result.rows[0];

            student.comment = student.comment ? student.comment : '';
            student.start_date = student.start_date > 1 ? student.start_date : 0;
            student.end_date = student.end_date > 1 ? student.end_date : 0;

            delete student.password;
            delete student.password_reset_req;
            delete student.salt;

            return student;
        }).catch(result => {
            result.connection.destroy();
            console.log(result.error);
            
            return ['Internal error'];
        });
    }

    static async addStudent(form) {
        // Check if student already exists
        let statement = 'SELECT nscc_id FROM student WHERE nscc_id = ?;';
        let params = [form.nscc_id];

        return await queryDatabase(statement, params).then(result => {
            result.connection.destroy();

            // Should be exactly one result
            if (result.rows.length >= 1) {
                // Already exists
                return {
                    failed: true,
                    error: 'User already exists'
                };
            }

            // Student is not pre-existing
            // Prepare insert statement
            let columns = '(`nscc_id`, `first_name`, `last_name`, `start_date`, `end_date`, `advisor`, `active`, `comment`, `password_reset_req`)';

            let statement = `INSERT INTO student ${columns} VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;

            // Form data
            let params = [
                form.nscc_id,
                form.first_name,
                form.last_name,
                form.start_date ? form.start_date : 0,
                form.end_date ? form.end_date : 0,
                form.advisor,
                form.active,
                form.comment,
                1
            ];

            // Execute query
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

    static async updateStudent(form) {
        let columns = 'active = ?, advisor = ?, comment = ?, end_date = ?, first_name = ?, last_name = ?, nscc_id = ?, start_date = ?';

        let params = [
            form.active,
            form.advisor,
            form.comment,
            form.end_date ? form.end_date : 0,
            form.first_name,
            form.last_name,
            form.nscc_id,
            form.start_date ? form.start_date : 0,
            form.nscc_id
        ];

        if (form.password_reset_req === 1) {
            // Only update password reset flag if necessary
            columns += form.password_reset_req ? ', password_reset_req = ?' : '';
            let nscc_id = params.pop();

            params.push(1);
            params.push(nscc_id);
        }

        // Prepare statement
        let statement = `UPDATE student SET ${columns} WHERE nscc_id = ?;`;

        return await queryDatabase(statement, params).then(result => {
            result.connection.destroy();

            if (result.rows) {
                if (result.rows.affectedRows < 1 || result.rows.changedRows < 1) {
                    return {
                        failed: true,
                        error: 'Could not update user'
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

    static async deleteStudent(nscc_id) {
        let statement = 'DELETE FROM student WHERE nscc_id = ?';
        let params = [nscc_id];

        return await queryDatabase(statement, params).then(result => {
            result.connection.destroy();

            // Check result
            if (result.rows) {
                if (result.rows.affectedRows < 1) {
                    // No affected rows means nothing happened
                    return {
                        failed: true,
                        error: 'User not found'
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

module.exports = StudentModel;
