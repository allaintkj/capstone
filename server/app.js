const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const sanitizer = require('express-sanitizer');

const config = require('./config.json');

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

/* ---------- REACT ROUTES ---------- */
app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../dist/index.html')));

// Run the server
app.listen(
    config.server.port,
    config.server.host,
    () => console.log(`HTTP server listening on http://${config.server.host}:${config.server.port}`)
);
