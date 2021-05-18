const express = require('express');
const router = express.Router();

const {
    fetchStudentProgress
} = require('../controllers/ProgressController');

router.route('/:id')
    .get(fetchStudentProgress);

module.exports = router;
