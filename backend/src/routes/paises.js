const express = require('express');
const router = express.Router();
const { getPaises, createPais } = require('../controllers/paisController');

router.get('/', getPaises);
router.post('/', createPais);

router.delete('/:id', (req, res) => {
    res.status(501).json({
        error: 'Funcionalidad no implementada'
    });
});

module.exports = router;