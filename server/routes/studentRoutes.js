const express = require('express');
const router = express.Router();

const {
    fetchAllStudents,
    updateStudent,
    fetchStudent,
    deleteStudent
} = require('../controllers/StudentController');

router.route('/all')
    .get(fetchAllStudents);

router.route('/add')
    .put(updateStudent);

router.route('/update')
    .post(updateStudent);

router.route('/:id')
    .get(fetchStudent)
    .delete(deleteStudent);

module.exports = router;
