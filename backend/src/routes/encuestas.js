const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// POST /api/encuestas - Crear nueva encuesta con respuestas
router.post('/', async (req, res) => {
    try {
        const { sede_id, respuestas } = req.body;
        if (!sede_id || !respuestas || !Array.isArray(respuestas)) {
            return res.status(400).json({
                error: 'Faltan campos requeridos',
                detalle: 'Se requieren sede_id y respuestas (array)'
            });
        }  
        if (respuestas.length === 0) {
            return res.status(400).json({
                error: 'Debe proporcionar al menos una respuesta'
            });
        }
        // Verificar que la sede existe
        const { data: sedeExiste, error: sedeError } = await supabase
            .from('sede')
            .select('id')
            .eq('id', sede_id)
            .is('fecha_eliminacion', null)
            .single();   
        if (sedeError || !sedeExiste) {
            return res.status(404).json({
                error: 'La sede especificada no existe'
            });
        }
        // Validar formato de respuestas
        for (let i = 0; i < respuestas.length; i++) {
            const resp = respuestas[i];
            if (!resp.pregunta_id || !resp.valor_respuesta) {
                return res.status(400).json({
                    error: 'Formato inválido de respuestas',
                    detalle: `La respuesta en posición ${i} debe tener pregunta_id y valor_respuesta`
                });
            }
        }
        // Crear la encuesta
        const { data: nuevaEncuesta, error: encuestaError } = await supabase
            .from('encuesta')
            .insert([{
                sede_id
            }])
            .select('id, sede_id, fecha_creacion')
            .single();
        if (encuestaError) throw encuestaError;  
        // Crear las respuestas asociadas a la encuesta
        const respuestasParaInsertar = respuestas.map(resp => ({
            encuesta_id: nuevaEncuesta.id,
            pregunta_id: resp.pregunta_id,
            valor_respuesta: resp.valor_respuesta
        }));  
        const { data: respuestasCreadas, error: respuestasError } = await supabase
            .from('respuesta')
            .insert(respuestasParaInsertar)
            .select('id, pregunta_id, valor_respuesta, fecha_creacion');
        if (respuestasError) {
            await supabase
                .from('encuesta')
                .delete()
                .eq('id', nuevaEncuesta.id);
            throw respuestasError;
        }
        res.status(201).json({
            encuesta: nuevaEncuesta,
            respuestas: respuestasCreadas,
            total_respuestas: respuestasCreadas.length
        });  
    } catch (err) {
        console.error('Error al crear encuesta:', err);
        res.status(500).json({
            error: 'Error al crear encuesta',
            detalle: err.message
        });
    }
});

module.exports = router;