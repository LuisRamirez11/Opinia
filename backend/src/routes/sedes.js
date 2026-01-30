const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.get('/', async (req, res) => {
    try {
        const { pais_id, empresa_id } = req.query;

        const { data, error } = await supabase
            .from('sede')
            .select(`
                id, nombre, filial_id,
                filial:filial_id (
                    id,
                    empresa:empresa_id (id, nombre),
                    pais:pais_id (id, nombre)
                )
            `)
            .is('fecha_eliminacion', null);

        if (error) throw error;

        let resultados = data;
        if (pais_id) resultados = resultados.filter(s => s.filial?.pais?.id === pais_id);
        if (empresa_id) resultados = resultados.filter(s => s.filial?.empresa?.id === empresa_id);
        
        resultados.sort((a, b) => a.nombre.localeCompare(b.nombre));
        res.status(200).json(resultados);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;