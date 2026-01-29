const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.get('/', async (req, res) => {
    try{
        const { data, error } = await supabase
        .from('pais')
        .select('id, nombre')
        .is('fecha_eliminacion', null)
        .order('nombre');
        if (error) throw error;
        res.status(200).json(data);

    } catch (err) {
        res.status(500).json({
            'Error':err
        });
    }
});

module.exports = router;