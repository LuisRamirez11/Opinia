const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET /api/sedes
router.get('/', async (req, res) => {
    try {
        const { pais_id, empresa_id } = req.query;
        if (pais_id || empresa_id) {
            let query = supabase
                .from('sede')
                .select(`id, nombre, filial_id, filial:filial_id (id, empresa:empresa_id (id, nombre), pais:pais_id (id, nombre))`)
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
    } catch (err) {
        console.error('Error al obtener sedes:', err);
        res.status(500).json({
            error: 'Error al obtener sedes',
            detalle: err.message
        });
    }
});

module.exports = router;