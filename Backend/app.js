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

const fs = require('fs');

// Compute repository root reliably regardless of current working directory.
// App.js lives in Backend/, so repository root is parent of Backend.
const projectRoot = path.resolve(__dirname, '..');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// API Routes
// Serve frontend for root route
app.get('/', (req, res) => {
    const indexPath = path.join(projectRoot, 'Frontend', 'dist', 'index.html');
    if (fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
    }
    return res.status(404).json({ success: false, message: "Frontend not built. Run 'npm run build' in the Frontend folder." });
});

app.use('/api/profiles', profileRoutes);
app.use('/api/events', eventRoutes);

// Serve static frontend files
const staticDir = path.join(projectRoot, 'Frontend', 'dist');
if (fs.existsSync(staticDir)) {
    app.use(express.static(staticDir));
} else {
    // If the static build doesn't exist, provide a simple route response rather than throwing on every request.
    console.warn(`Frontend dist not found at ${staticDir} — static files will not be served.`);
}

// Fallback for SPA routing (all non-API routes)
app.get(/^\/(?!api).*/, (req, res) => {
    const indexPath = path.join(projectRoot, 'Frontend', 'dist', 'index.html');
    if (fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
    }
    return res.status(404).json({ success: false, message: "Frontend not built. Run 'npm run build' in the Frontend folder." });
});

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;