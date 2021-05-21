const {
    queryDatabase,
    closeDatabase
} = require('../services/db');

class AuthModel {
    constructor() { }

    static async passwordResetCheck(form) {
        // Check in student table
        let statement = 'SELECT password_reset_req FROM student WHERE nscc_id = ?;';
        let params = [form.nscc_id];

        return await queryDatabase(statement, params).then(rows => {
            if ((!rows) || (rows.length < 1)) {
                // Not in students
                // Check admin table
                let statement = 'SELECT password_reset_req FROM admin WHERE nscc_id = ?;';
                return queryDatabase(statement, params);
            }
        }).then(rows => {
            if ((!rows) || (rows.length < 1)) {
                // Does not exist in either users table
                return {
                    failed: true,
                    error: 'Could not find that ID'
                };
            }

            if (rows.length !== 1) {
                // Should be exactly one result
                return {
                    failed: true,
                    error: 'Duplicate user detected, contact database administrator'
                };
            }

            // Found record
            if (parseInt(rows[0].password_reset_req, 10) === 1) {
                // Reset required
                // Return null error object so the controller knows it's HTTP 300
                return {
                    failed: true,
                    error: null
                };
            }
        }).catch(() => {
            closeDatabase();
            return {
                failed: true,
                error: 'Internal error'
            };
        });
    }

    static async login(form) {
    }
}

module.exports = AuthModel;
