const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET /api/sedes - Obtener todas las sedes o filtradas por país y/o empresa
router.get('/', async (req, res) => {
    try {
        const { pais_id, empresa_id } = req.query;
        if (pais_id || empresa_id) {
            let query = supabase
                .from('sede')
                .select(`
                    id,
                    nombre,
                    direccion,
                    filial_id,
                    fecha_creacion,
                    filial:filial_id (
                        id,
                        empresa:empresa_id (
                            id,
                            nombre
                        ),
                        pais:pais_id (
                            id,
                            nombre
                        )
                    )
                `)
                .is('fecha_eliminacion', null);
            const { data: todasSedes, error: sedesError } = await query;
            
            if (sedesError) throw sedesError;
            let sedesFiltradas = todasSedes;      
            if (pais_id) {
                sedesFiltradas = sedesFiltradas.filter(sede => 
                    sede.filial?.pais?.id === pais_id
                );
            }   
            if (empresa_id) {
                sedesFiltradas = sedesFiltradas.filter(sede => 
                    sede.filial?.empresa?.id === empresa_id
                );
            }           
            sedesFiltradas.sort((a, b) => a.nombre.localeCompare(b.nombre));  
            return res.status(200).json(sedesFiltradas);
        }
        
        const { data, error } = await supabase
            .from('sede')
            .select(`
                id,
                nombre,
                direccion,
                filial_id,
                fecha_creacion,
                filial:filial_id (
                    id,
                    empresa:empresa_id (
                        id,
                        nombre
                    ),
                    pais:pais_id (
                        id,
                        nombre
                    )
                )
            `)
            .is('fecha_eliminacion', null)
            .order('nombre');
        if (error) throw error;      
        res.status(200).json(data);    
    } catch (err) {
        console.error('Error al obtener sedes:', err);
        res.status(500).json({
            error: 'Error al obtener sedes',
            detalle: err.message
        });
    }
});

// POST /api/sedes - Crear una nueva sede
router.post('/', async (req, res) => {
    try {
        res.status(501).json({
            error: 'Endpoint no implementado'
        });
    } catch (err) {
        console.error('Error al crear sede:', err);
        res.status(500).json({
            error: 'Error al crear sede',
            detalle: err.message
        });
    }
});

// DELETE /api/sedes/:id - Eliminación lógica de una sede
router.delete('/:id', async (req, res) => {
    try {
        res.status(501).json({
            error: 'Endpoint no implementado'
        });
    } catch (err) {
        console.error('Error al eliminar sede:', err);
        res.status(500).json({
            error: 'Error al eliminar sede',
            detalle: err.message
        });
    }
});

module.exports = router;