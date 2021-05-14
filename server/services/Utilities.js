const jwt = require('jsonwebtoken');
const path = require('path');

const jwtConfig = require(path.resolve(__dirname, '../config.jwt.json'));

class Utilities {
    constructor() {
        this._messages = {};
        this._payload = '';
    }

    // gets
    get messages() { return this._messages; }
    get payload() { return this._payload; }

    // sets
    set messages(value) { this._messages = value; }
    set payload(value) { this._payload = value; }

    // helpers
    date(date) {
        let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
        let year = date.getFullYear();

        return `${year}-${month}-${day}`;
    }

    respond(res, status, msg = '', data = '') {
        let payload = this._payload;
        let secret = jwtConfig.secret;
        let expiry = {expiresIn: jwtConfig.expiry};

        if (status === 401) {
            // not authorized
            res.status(status);
            res.send(msg);

            return;
        }

        jwt.sign(payload, secret, expiry, (err, token) => {
            if (err) {
                this.serverLog(err);

                res.status(500);
                res.send({text: 'Internal error signing token'});

                return;
            }

            res.header('Access-Control-Expose-Headers', 'token');
            res.header('token', token);
            res.status(status);
            res.send(msg ? msg : (data ? data : ''));

            return;
        });
    }

    serverLog(item) {
        console.log('\n[alp-progress]'); // eslint-disable-line
        console.log(item); // eslint-disable-line
    }

    verifyToken(req) {
        let decoded = false;
        let token = req.get('token');

        if (!token) { return false; }

        try {
            decoded = jwt.verify(token, jwtConfig.secret);
        } catch (exception) {
            this._messages = exception.name.includes('Expired') ? 'Session timed out' : 'Invalid token';

            this.serverLog(exception);
            return false;
        }

        return decoded;
    }
}

module.exports = Utilities;
