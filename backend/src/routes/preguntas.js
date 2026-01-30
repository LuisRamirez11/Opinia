const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.get('/', async (req, res) => {
    try {
        const { empresa_id } = req.query;
        if (!empresa_id) return res.status(400).json({ error: 'empresa_id requerido' });

        const { data, error } = await supabase
            .from('pregunta')
            .select('*')
            .eq('empresa_id', empresa_id)
            .eq('activo', true)
            .is('fecha_eliminacion', null)
            .order('orden', { ascending: true });

        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { empresa_id, texto_pregunta, orden, activo } = req.body;
        if (!empresa_id || !texto_pregunta) return res.status(400).json({ error: 'Faltan datos' });

        const { data, error } = await supabase
            .from('pregunta')
            .insert([{
                empresa_id,
                texto_pregunta: texto_pregunta.trim(),
                orden: orden || 0,
                activo: activo ?? false
            }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;