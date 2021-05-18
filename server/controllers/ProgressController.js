const path = require('path');

const ProgressModel = require('../models/ProgressModel');

const Utilities = require(path.resolve(__dirname, '../services/Utilities'));

exports.fetchStudentProgress = async(req, res) => {
    let utils = new Utilities();

    try {
        // Verification
        let decoded = utils.verifyToken(req);

        if (!decoded) {
            // Failed
            utils.respond(res, 401, {text: utils.messages});

            return;
        }

        utils.payload = {
            // Success, set payload for token refresh
            nscc_id: decoded.nscc_id,
            type: decoded.type
        };

        try {
            req.params.nscc_id = req.sanitize(req.params.id);
        } catch (exception) {
            utils.respond(res, 400, {text: 'Invalid user ID'});

            return;
        }

        if (utils.payload.nscc_id !== req.params.nscc_id) {
            if (utils.payload.type !== 'faculty') {
                // Valid token, not authorized for this resource
                utils.respond(res, 401, {text: 'You are not authorized to access that resource'});

                return;
            }
        }

        // Get all progress records for ID
        let progressModel = new ProgressModel();
        let progress = await progressModel.getProgress(req.params.id);

        utils.respond(res, 200, progress);
    } catch (err) {
        console.log(err);

        utils.respond(res, 500, {text: 'Internal error querying database'});
    }
};
