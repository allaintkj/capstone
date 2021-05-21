const {
    queryDatabase,
    closeDatabase
} = require('../services/db');

class StudentModel {
    constructor() { }

    async fetchAllStudents() {
        let statement = 'SELECT * FROM student ORDER BY last_name';

        return await queryDatabase(statement).then(rows => {
            if ((!rows) || (rows.length < 1)) {
                closeDatabase();
                return;
            }

            // Initialize array to contain students
            let students = [];

            // Iterate returned records and manicure the data
            rows.forEach(student => {
                student.comment = student.comment ? student.comment : '';
                if (student.start_date) { student.start_date = new Date(student.start_date); }
                if (student.end_date) { student.end_date = new Date(student.end_date); }

                delete student.password;
                delete student.password_reset_req;
                delete student.salt;

                students.push(student);
            });

            closeDatabase();
            return (students);
        }).catch(() => {
            closeDatabase();
            return ['Internal error'];
        });
    }

    async fetchStudent(request) {
        let statement = 'SELECT * FROM student WHERE nscc_id = ? ORDER BY last_name';
        let params = [request.params.id];

        return await queryDatabase(statement, params).then(rows => {
            // Only a single result should be return
            // Otherwise we've introduced a duplicate user somehow
            if ((!rows) || (rows.length !== 1)) {
                closeDatabase();
                return;
            }

            let student = rows[0];

            student.comment = student.comment ? student.comment : '';
            if (student.start_date) { student.start_date = new Date(student.start_date); }
            if (student.end_date) { student.end_date = new Date(student.end_date); }

            delete student.password;
            delete student.password_reset_req;
            delete student.salt;

            closeDatabase();
            return (student);
        }).catch(() => {
            closeDatabase();
            return ['Internal error'];
        });
    }
}

module.exports = StudentModel;
