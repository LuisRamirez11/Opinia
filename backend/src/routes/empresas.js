const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.get('/', async (req, res) => {
    try {
        const { pais_id } = req.query;
        if (!pais_id) return res.status(200).json([]);

        const { data: filiales, error } = await supabase
            .from('filial')
            .select(`empresa:empresa_id (id, nombre, fecha_creacion)`)
            .eq('pais_id', pais_id)
            .is('fecha_eliminacion', null)
            .order('empresa(nombre)');

        if (error) throw error;
        const empresas = filiales.map(f => f.empresa);
        res.status(200).json(empresas);
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
            .from('empresa')
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