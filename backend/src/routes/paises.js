const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET /api/paises - Obtener todos los países
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
        console.error('Error al obtener países:', err);
        res.status(500).json({
            error: 'Error al obtener países',
            detalle: err.message
        });
    }
});

// GET /api/paises/:id - Obtener un país específico
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const { data, error } = await supabase
            .from('pais')
            .select('id, nombre')
            .eq('id', id)
            .is('fecha_eliminacion', null)
            .single();
        
        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({
                    error: 'País no encontrado'
                });
            }
            throw error;
        }
        res.status(200).json(data);
    } catch (err) {
        console.error('Error al obtener país:', err);
        res.status(500).json({
            error: 'Error al obtener país',
            detalle: err.message
        });
    }
});

// POST /api/paises - Crear un nuevo país
router.post('/', async (req, res) => {
    try {
        const { nombre } = req.body;        
        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({
                error: 'El nombre del país es requerido'
            });
        }
        const { data, error } = await supabase
            .from('pais')
            .insert([{
                nombre: nombre.trim()
            }])
            .select('id, nombre, fecha_creacion')
            .single();
        if (error) throw error;    
        res.status(201).json(data);
    } catch (err) {
        console.error('Error al crear país:', err);
        res.status(500).json({
            error: 'Error al crear país',
            detalle: err.message
        });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        res.status(501).json({
            error: 'Funcionalidad no implementada'
        })

    } catch(err) {
        console.error('Error al eliminar país:', err);
    }
});

module.exports = router;