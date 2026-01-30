const express = require('express');
const router = express.Router();
const { getEmpresas, createEmpresa } = require('../controllers/empresaController');

router.get('/', getEmpresas);
router.post('/', createEmpresa);

module.exports = router;