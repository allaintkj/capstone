const express = require('express');
const router = express.Router();

const {
    fetchAllCourses
} = require('../controllers/CourseController');

router.route('/all')
    .get(fetchAllCourses);

module.exports = router;
