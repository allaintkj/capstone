const bodyParser = require('body-parser');
const express = require('express');
const sanitizer = require('express-sanitizer');
const path = require('path');

const config = require('./config/config.json');

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const studentRoutes = require('./routes/studentRoutes');
const progressRoutes = require('./routes/progressRoutes');

const app = express();

app.use(sanitizer());
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, '../dist')));

/* AUTH ROUTES ------------------------ */
app.use('/api/auth', authRoutes);

/* COURSE ROUTES ---------------------- */
app.use('/api/courses', courseRoutes);

/* STUDENT ROUTES --------------------- */
app.use('/api/students', studentRoutes);

/* PROGRESS ROUTES -------------------- */
app.use('/api/progress', progressRoutes);

/* ---------- COURSE ROUTES ---------- */
require(path.resolve(__dirname, 'course/add'))(app);
require(path.resolve(__dirname, 'course/delete'))(app);
require(path.resolve(__dirname, 'course/update'))(app);

/* ---------- GENERAL USER ROUTES ---------- */
require(path.resolve(__dirname, 'users/add'))(app);
require(path.resolve(__dirname, 'users/delete'))(app);
require(path.resolve(__dirname, 'users/update'))(app);

/* ---------- REACT ROUTES ---------- */
app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../dist/index.html')));

// Run the server
app.listen(
    config.server.port,
    config.server.host,
    () => console.log(`HTTP server listening on http://${config.server.host}:${config.server.port}`)
);
