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

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// API Routes
app.get('/', (req, res) => {
    res.json({ 
        success: true,
        message: 'Event Management System API',
        version: '1.0.0'
    });
});

app.use('/api/profiles', profileRoutes);
app.use('/api/events', eventRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;