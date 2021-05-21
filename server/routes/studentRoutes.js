const express = require('express');
const router = express.Router();

const {
    fetchAllStudents,
    fetchStudent
} = require('../controllers/StudentController');

router.route('/all')
    .get(fetchAllStudents);

router.route('/:id')
    .get(fetchStudent);

module.exports = router;
