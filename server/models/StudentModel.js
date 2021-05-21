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
                if (student.start_date) { student.start_date = new Date(student.start_date); }
                if (student.end_date) { student.end_date = new Date(student.end_date); }

                delete student.password;
                delete student.password_reset_req;
                delete student.salt;

                return student;
            });
        }).catch(() => {
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
            if (student.start_date) { student.start_date = new Date(student.start_date); }
            if (student.end_date) { student.end_date = new Date(student.end_date); }

            delete student.password;
            delete student.password_reset_req;
            delete student.salt;

            return student;
        }).catch(() => {
            closeDatabase();
            return ['Internal error'];
        });
    }
}

module.exports = StudentModel;
