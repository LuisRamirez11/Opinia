const serverless = require('serverless-http');
const app = require('./app');
require('dotenv').config();

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto: ${PORT}`);
    });
}

module.exports.handler = serverless(app);
