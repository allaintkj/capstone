const { validation } = require('../config/config.json');

exports.validateId = nscc_id => {
    let expression = RegExp(validation.patterns.nscc_id);
    return expression.test(nscc_id);
};
