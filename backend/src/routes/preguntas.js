const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET /api/preguntas
router.get('/', async (req, res) => {
    try {
        const { empresa_id } = req.query;  
        if (!empresa_id) {
            return res.status(400).json({
                error: 'El parámetro empresa_id es requerido'
            });
        }
        const { data: empresaExiste, error: empresaError } = await supabase
            .from('empresa')
            .select('id')
            .eq('id', empresa_id)
            .is('fecha_eliminacion', null)
            .single();
        if (empresaError || !empresaExiste) {
            return res.status(404).json({
                error: 'La empresa especificada no existe'
            });
        }
        const { data, error } = await supabase
            .from('pregunta')
            .select('id, texto_pregunta, tipo_respuesta, orden, activo, fecha_creacion')
            .eq('empresa_id', empresa_id)
            .eq('activo', true)
            .is('fecha_eliminacion', null)
            .order('orden', { ascending: true });  
        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        console.error('Error al obtener preguntas:', err);
        res.status(500).json({
            error: 'Error al obtener preguntas',
            detalle: err.message
        });
    }
});


// POST /api/preguntas
router.post('/', async (req, res) => {
    try {
        const { empresa_id, texto_pregunta, tipo_respuesta, orden, activo } = req.body;
        if (!empresa_id || !texto_pregunta) {
            return res.status(400).json({
                error: 'Faltan campos requeridos',
                detalle: 'Se requieren empresa_id y texto_pregunta'
            });
        } 
        if (texto_pregunta.trim() === '') {
            return res.status(400).json({
                error: 'El texto de la pregunta no puede estar vacío'
            });
        }
        const { data: empresaExiste, error: empresaError } = await supabase
            .from('empresa')
            .select('id')
            .eq('id', empresa_id)
            .is('fecha_eliminacion', null)
            .single();
        if (empresaError || !empresaExiste) {
            return res.status(404).json({
                error: 'La empresa especificada no existe'
            });
        }
        const { data, error } = await supabase
            .from('pregunta')
            .insert([{
                empresa_id,
                texto_pregunta: texto_pregunta.trim(),
                tipo_respuesta: tipo_respuesta || null,
                orden: orden || 0,
                activo: activo !== undefined ? activo : false
            }])
            .select('id, empresa_id, texto_pregunta, tipo_respuesta, orden, activo, fecha_creacion')
            .single();   
        if (error) throw error;
        res.status(201).json(data);      
    } catch (err) {
        console.error('Error al crear pregunta:', err);
        res.status(500).json({
            error: 'Error al crear pregunta',
            detalle: err.message
        });
    }
});

module.exports = router;