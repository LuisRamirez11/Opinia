const express = require('express');
const router = express.Router();

router.use('/paises', require('./paises'));
router.use('/empresas', require('./empresas'));
router.use('/sedes', require('./sedes'));
router.use('/preguntas', require('./preguntas'));
router.use('/encuestas', require('./encuestas'));

module.exports = router;