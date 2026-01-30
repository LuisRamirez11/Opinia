const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes/index');

const app = express();

app.use(cors());
app.use(express.json());

// Status Endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'opinia-backend',
        timestamp: new Date().toISOString()
    });
});

app.use('/api', routes);

// Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: err.message || 'Error del servidor' });
});

// Local Dev Server
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto: ${PORT}`);
    });
}

module.exports.handler = serverless(app);
