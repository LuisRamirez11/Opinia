const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes/index');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api', routes);

// Error Handling Middleware should be last
app.use(errorHandler);

module.exports = app;
