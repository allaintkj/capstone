const path = require('path');
const mysql = require('mysql');
const dbConfig = require(path.resolve(__dirname, '../config.db.json'));

class Database {
    constructor() {
        this.connection = mysql.createConnection(dbConfig);
    }

    query(statement, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(statement, args, (error, rows) => {
                if (error) { return reject(error); }
                resolve(rows);
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(error => {
                if (error) { return reject(error); }
                resolve();
            });
        });
    }
}

module.exports = Database;
