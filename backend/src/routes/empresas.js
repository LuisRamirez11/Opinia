const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET /api/empresas
router.get('/', async (req, res) => {
    try {
        const { pais_id } = req.query;        

        if (pais_id) {            
            const { data: filiales, error: filialesError } = await supabase
                .from('filial')
                .select(`
                    empresa:empresa_id (
                        id,
                        nombre,
                        fecha_creacion
                    )
                `)
                .eq('pais_id', pais_id)
                .is('fecha_eliminacion', null)
                .order('empresa(nombre)');
            if (filialesError) throw filialesError;
            const empresas = filiales.map(filial => filial.empresa);            
            return res.status(200).json(empresas);
        }    
    } catch (err) {
        console.error('Error al obtener empresas:', err);
        res.status(500).json({
            error: 'Error al obtener empresas',
            detalle: err.message
        });
    }
});

// POST /api/empresas
router.post('/', async (req, res) => {
    try {
        const { nombre } = req.body;
        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({
                error: 'El nombre de la empresa es requerido'
            });
        }
        const { data, error } = await supabase
            .from('empresa')
            .insert([{
                nombre: nombre.trim()
            }])
            .select('id, nombre, fecha_creacion')
            .single();
        if (error) throw error;      
        res.status(201).json(data);    
    } catch (err) {
        console.error('Error al crear empresa:', err);
        res.status(500).json({
            error: 'Error al crear empresa',
            detalle: err.message
        });
    }
});

module.exports = router;