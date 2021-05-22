const mysql = require('mysql');
const { database } = require('../config.json');

exports.queryDatabase = (statement, args) => {
    return new Promise((resolve, reject) => {
        mysql.createConnection(database).query(statement, args, (error, rows) => {
            if (error) { return reject(error); }
            resolve(rows);
        });
    });
};

exports.closeDatabase = () => {
    return new Promise((resolve, reject) => {
        mysql.createConnection(database).end(error => {
            if (error) { return reject(error); }
            resolve();
        });
    });
};
