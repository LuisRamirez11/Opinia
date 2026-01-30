const express = require('express');
const router = express.Router();
const { getPreguntas, createPregunta } = require('../controllers/preguntaController');

router.get('/', getPreguntas);
router.post('/', createPregunta);

module.exports = router;