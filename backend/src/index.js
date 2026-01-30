const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes/index');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api', routes);

if (process.env.NODE_ENV != 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto: ${PORT}`);
    });
}

module.exports.handler = serverless(app);

