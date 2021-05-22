const crypto = require('crypto');

const {
    queryDatabase,
    closeDatabase
} = require('../services/db');

class AuthModel {
    constructor() { }

    static async passwordResetCheck(form) {
        // Check in student table
        let isAdmin = false;
        let statement = 'SELECT password_reset_req FROM student WHERE nscc_id = ?;';
        let params = [form.nscc_id];

        return await queryDatabase(statement, params).then(rows => {
            if ((!rows) || (rows.length < 1)) {
                // Not in students
                // Check admin table
                let statement = 'SELECT password_reset_req FROM administrators WHERE nscc_id = ?;';
                // Pass this back to controller
                // Saves us some trouble in login()
                isAdmin = true;
                return queryDatabase(statement, params);
            }

            return rows;
        }).then(rows => {
            if ((!rows) || (rows.length < 1)) {
                closeDatabase();
                // Does not exist in either users table
                return {
                    failed: true,
                    error: 'Could not find that ID'
                };
            }

            if (rows.length !== 1) {
                closeDatabase();
                // Should be exactly one result
                return {
                    failed: true,
                    error: 'Duplicate user detected, contact database administrator'
                };
            }

            if (parseInt(rows[0].password_reset_req, 10) === 1) {
                closeDatabase();
                // Reset required
                // Return null error object so the controller knows it's HTTP 300
                return {
                    failed: true,
                    error: null,
                    isAdmin: isAdmin
                };
            }

            return {
                failed: false,
                error: null,
                isAdmin: isAdmin
            };
        }).catch(() => {
            closeDatabase();
            return {
                failed: true,
                error: 'Internal error'
            };
        });
    }

    static async login(form, isAdmin) {
        let statement = 'SELECT password, salt FROM student WHERE nscc_id = ?;';
        let params = [form.nscc_id];

        // This is where the isAdmin flag from passwordResetCheck() comes in handy
        if (isAdmin) { statement = 'SELECT password, salt FROM administrators WHERE nscc_id = ?;'; }

        return await queryDatabase(statement, params).then(rows => {
            if ((!rows) || (rows.length < 1)) {
                closeDatabase();
                // Does not exist in either users table
                return {
                    failed: true,
                    error: 'Could not find that ID'
                };
            }

            if (rows.length !== 1) {
                closeDatabase();
                // Should be exactly one result
                return {
                    failed: true,
                    error: 'Duplicate user detected, contact database administrator'
                };
            }

            let storedHash = rows[0].password;
            let salt = rows[0].salt;
            let hash = crypto.pbkdf2Sync(form.password, salt, 1000, 64, 'sha512').toString('hex');

            if (storedHash !== hash) {
                closeDatabase();
                // Password incorrect
                return {
                    failed: true,
                    error: 'Incorrect password'
                };
            }

            // Successful login
            return {
                failed: false,
                error: null
            };
        }).catch(() => {
            closeDatabase();
            return {
                failed: true,
                error: 'Internal error'
            };
        });
    }

    static async resetPassword(form) {
        let statement = 'SELECT * FROM student WHERE nscc_id = ?;';
        let params = [form.nscc_id];

        if (form.admin) { statement = 'SELECT * FROM administrators WHERE nscc_id = ?;'; }

        return await queryDatabase(statement, params).then(rows => {
            closeDatabase();

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

            // Salt and hash new password
            let salt = crypto.randomBytes(32).toString('hex');
            let hash = crypto.pbkdf2Sync(form.password, salt, 1000, 64, 'sha512').toString('hex');

            // Update statement
            let columns = 'salt = ?, password = ?, password_reset_req = ?';
            statement = `UPDATE student SET ${columns} WHERE nscc_id = ?;`;
            params = [
                salt,
                hash,
                0,
                form.nscc_id
            ];

            // Exceute query
            return queryDatabase(statement, params);
        }).then(rows => {
            closeDatabase();

            if (!rows) {
                return {
                    failed: true,
                    error: 'Internal error'
                };
            }
            
            return {
                failed: false,
                error: null
            };
        }).catch(() => {
            closeDatabase();
            return {
                failed: true,
                error: 'Internal error'
            };
        });
    }
}

module.exports = AuthModel;
