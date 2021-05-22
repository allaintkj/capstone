const {
    queryDatabase,
    closeDatabase
} = require('../services/db');

class StudentModel {
    constructor() { }

    static async fetchAllStudents() {
        let statement = 'SELECT * FROM student ORDER BY last_name';

        return await queryDatabase(statement).then(students => {
            closeDatabase();

            if ((!students) || (students.length < 1)) { return; }

            return students.map(student => {
                student.comment = student.comment ? student.comment : '';
                student.start_date = student.start_date > 1 ? student.start_date : 0;
                student.end_date = student.end_date > 1 ? student.end_date : 0;

                delete student.password;
                delete student.password_reset_req;
                delete student.salt;

                return student;
            });
        }).catch(error => {
            console.log(error);

            closeDatabase();
            
            return ['Internal error'];
        });
    }

    static async fetchStudent(request) {
        let statement = 'SELECT * FROM student WHERE nscc_id = ? ORDER BY last_name';
        let params = [request.params.id];

        return await queryDatabase(statement, params).then(students => {
            closeDatabase();

            // Only a single result should be returned
            // Otherwise we've introduced a duplicate user somehow
            if ((!students) || (students.length !== 1)) { return; }

            let student = students[0];

            student.comment = student.comment ? student.comment : '';
            student.start_date = student.start_date > 1 ? student.start_date : 0;
            student.end_date = student.end_date > 1 ? student.end_date : 0;

            delete student.password;
            delete student.password_reset_req;
            delete student.salt;

            return student;
        }).catch(error => {
            console.log(error);

            closeDatabase();
            
            return ['Internal error'];
        });
    }

    static async updateStudent(form) {
        let columns = 'active = ?, advisor = ?, comment = ?, end_date = ?, first_name = ?, last_name = ?, nscc_id = ?, start_date = ?';

        let params = [
            form.active,
            form.advisor,
            form.comment,
            form.end_date,
            form.first_name,
            form.last_name,
            form.nscc_id,
            form.start_date,
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

        return await queryDatabase(statement, params).then(rows => {
            closeDatabase();

            if (rows) {
                if (rows.affectedRows < 1) {
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

module.exports = StudentModel;
