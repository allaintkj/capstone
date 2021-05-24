const mysql = require('mysql');
const { database } = require('../config.json');

exports.queryDatabase = (statement, args) => {
    return new Promise((resolve, reject) => {
        // Create the connection to pass with result
        let connection = mysql.createConnection(database);

        // Pass connection to the model so it can be closed when necessary
        connection.query(statement, args, (error, rows) => {
            if (error) {
                return reject({
                    error: error,
                    connection: connection
                });
            }

            resolve({
                rows: rows,
                connection: connection
            });
        });
    });
};
