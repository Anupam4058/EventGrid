const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const connectToDb = require('./database/db');
const errorHandler = require('./middleware/errorHandler');

// Routes
const profileRoutes = require('./routes/profileRoutes');
const eventRoutes = require('./routes/eventRoutes');

// Connect to database
connectToDb();

const _dirname = path.resolve();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// API Routes
// Serve frontend for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(_dirname, 'Frontend', 'dist', 'index.html'));
});

app.use('/api/profiles', profileRoutes);
app.use('/api/events', eventRoutes);

// Serve static frontend files
app.use(express.static(path.join(_dirname, 'Frontend', 'dist')));

// Fallback for SPA routing (all non-API routes)
app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(_dirname, 'Frontend', 'dist', 'index.html'));
});

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;