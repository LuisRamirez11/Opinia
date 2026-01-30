const express = require('express');
const router = express.Router();
const { createEncuesta, getReporte } = require('../controllers/encuestaController');

router.post('/', createEncuesta);
router.get('/reporte', getReporte);

module.exports = router;