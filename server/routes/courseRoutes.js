const express = require('express');
const router = express.Router();

const {
    fetchAllCourses,
    updateCourse
} = require('../controllers/CourseController');

router.route('/all')
    .get(fetchAllCourses);

router.route('/add')
    .put(updateCourse);

router.route('/update')
    .post(updateCourse);

module.exports = router;
