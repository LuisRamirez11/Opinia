const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('pais')
            .select('id, nombre')
            .is('fecha_eliminacion', null)
            .order('nombre');

        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { nombre } = req.body;
        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({ error: 'Nombre requerido' });
        }

        const { data, error } = await supabase
            .from('pais')
            .insert([{ nombre: nombre.trim() }])
            .select('id, nombre, fecha_creacion')
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;