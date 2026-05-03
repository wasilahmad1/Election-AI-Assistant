require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/apiRoutes');
const errorHandler = require('./utils/errorHandler');
const logger = require('./utils/logger');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api', apiRoutes);

// Centralized Error Handling
app.use(errorHandler);

// Start Server
app.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}`);
});
