const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.post('/', async (req, res) => {
    try {
        const { sede_id, respuestas } = req.body;
        if (!sede_id || !respuestas?.length) {
            return res.status(400).json({ error: 'Faltan datos' });
        }

        const { data: encuesta, error: errEnc } = await supabase
            .from('encuesta')
            .insert([{ sede_id }])
            .select('id, sede_id')
            .single();

        if (errEnc) throw errEnc;

        const inserts = respuestas.map(r => ({
            encuesta_id: encuesta.id,
            pregunta_id: r.pregunta_id,
            valor_respuesta: r.valor_respuesta
        }));

        const { data: resps, error: errResp } = await supabase
            .from('respuesta')
            .insert(inserts)
            .select();

        if (errResp) {
            await supabase.from('encuesta').delete().eq('id', encuesta.id);
            throw errResp;
        }

        res.status(201).json({ encuesta, respuestas: resps });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/reporte', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('respuesta')
            .select(`
                valor_respuesta, fecha_creacion,
                pregunta:pregunta_id(texto_pregunta),
                encuesta:encuesta_id(
                    sede:sede_id(
                        nombre,
                        filial:filial_id(
                            empresa:empresa_id(nombre),
                            pais:pais_id(nombre)
                        )
                    )
                )
            `)
            .order('fecha_creacion', { ascending: false });

        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;