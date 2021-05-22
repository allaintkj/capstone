const express = require('express');
const router = express.Router();

const {
    fetchAllCourses,
    updateCourse,
    deleteCourse
} = require('../controllers/CourseController');

router.route('/all')
    .get(fetchAllCourses);

router.route('/add')
    .put(updateCourse);

router.route('/update')
    .post(updateCourse);

router.route('/:id')
    .delete(deleteCourse);

module.exports = router;
