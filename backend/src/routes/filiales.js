const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET /api/filiales - Obtener todas las filiales (con filtros opcionales)
router.get('/', async(req, res) => {
    try {
        const { pais_id, empresa_id } = req.query;
        
        let query = supabase
            .from('filial')
            .select(`
                id,
                empresa_id,
                pais_id,
                empresa:empresa_id (
                    id,
                    nombre
                ),
                pais:pais_id (
                    id,
                    nombre
                )
            `)
            .is('fecha_eliminacion', null);
        
        // Aplicar filtros si se proporcionan
        if (pais_id) {
            query = query.eq('pais_id', pais_id);
        }
        
        if (empresa_id) {
            query = query.eq('empresa_id', empresa_id);
        }
        
        query = query.order('fecha_creacion', { ascending: false });
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        res.status(200).json(data);
        
    } catch(err) {
        console.error('Error al obtener filiales:', err);
        res.status(500).json({
            error: 'Error al obtener filiales',
            detalle: err.message
        });
    }
});

// GET /api/filiales/:id - Obtener una filial específica
router.get('/:id', async(req, res) => {
    try {
        const { id } = req.params;
        
        const { data, error } = await supabase
            .from('filial')
            .select(`
                id,
                empresa_id,
                pais_id,
                fecha_creacion,
                empresa:empresa_id (
                    id,
                    nombre
                ),
                pais:pais_id (
                    id,
                    nombre
                )
            `)
            .eq('id', id)
            .is('fecha_eliminacion', null)
            .single();
        
        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({
                    error: 'Filial no encontrada'
                });
            }
            throw error;
        }
        
        res.status(200).json(data);
        
    } catch(err) {
        console.error('Error al obtener filial:', err);
        res.status(500).json({
            error: 'Error al obtener filial',
            detalle: err.message
        });
    }
});

// POST /api/filiales - Crear una nueva filial
router.post('/', async(req, res) => {
    try {
        const { empresa_id, pais_id } = req.body;
        
        // Validar que se proporcionen los campos requeridos
        if (!empresa_id || !pais_id) {
            return res.status(400).json({
                error: 'Faltan campos requeridos',
                detalle: 'Se requieren empresa_id y pais_id'
            });
        }
        
        // Verificar que la empresa existe
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
        
        // Verificar que el país existe
        const { data: paisExiste, error: paisError } = await supabase
            .from('pais')
            .select('id')
            .eq('id', pais_id)
            .is('fecha_eliminacion', null)
            .single();
        
        if (paisError || !paisExiste) {
            return res.status(404).json({
                error: 'El país especificado no existe'
            });
        }
        
        // Verificar si ya existe una filial con la misma combinación empresa-país
        const { data: filialExistente } = await supabase
            .from('filial')
            .select('id')
            .eq('empresa_id', empresa_id)
            .eq('pais_id', pais_id)
            .is('fecha_eliminacion', null)
            .single();
        
        if (filialExistente) {
            return res.status(409).json({
                error: 'Ya existe una filial con esta combinación de empresa y país'
            });
        }
        
        // Crear la filial
        const { data, error } = await supabase
            .from('filial')
            .insert([{
                empresa_id,
                pais_id
            }])
            .select(`
                id,
                empresa_id,
                pais_id,
                fecha_creacion,
                empresa:empresa_id (
                    id,
                    nombre
                ),
                pais:pais_id (
                    id,
                    nombre
                )
            `)
            .single();
        
        if (error) throw error;
        
        res.status(201).json(data);
        
    } catch(err) {
        console.error('Error al crear filial:', err);
        res.status(500).json({
            error: 'Error al crear filial',
            detalle: err.message
        });
    }
});

// DELETE /api/filiales/:id - Eliminación lógica de una filial
router.delete('/:id', async(req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar que la filial existe y no está eliminada
        const { data: filialExiste, error: checkError } = await supabase
            .from('filial')
            .select('id')
            .eq('id', id)
            .is('fecha_eliminacion', null)
            .single();
        
        if (checkError || !filialExiste) {
            return res.status(404).json({
                error: 'Filial no encontrada'
            });
        }
        
        // Verificar si la filial tiene sedes asociadas
        const { data: sedesAsociadas } = await supabase
            .from('sede')
            .select('id')
            .eq('filial_id', id)
            .is('fecha_eliminacion', null);
        
        if (sedesAsociadas && sedesAsociadas.length > 0) {
            return res.status(409).json({
                error: 'No se puede eliminar la filial porque tiene sedes asociadas',
                detalle: `Tiene ${sedesAsociadas.length} sede(s) asociada(s)`
            });
        }
        
        // Eliminación lógica
        const { data, error } = await supabase
            .from('filial')
            .update({ fecha_eliminacion: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        
        res.status(200).json({
            mensaje: 'Filial eliminada correctamente',
            data
        });
        
    } catch(err) {
        console.error('Error al eliminar filial:', err);
        res.status(500).json({
            error: 'Error al eliminar filial',
            detalle: err.message
        });
    }
});

module.exports = router;