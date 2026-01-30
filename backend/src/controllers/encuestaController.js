const supabase = require('../config/supabase');

const createEncuesta = async (req, res, next) => {
    try {
        const { sede_id, respuestas } = req.body;
        if (!sede_id || !respuestas || !Array.isArray(respuestas)) {
            res.status(400);
            throw new Error('Faltan campos requeridos: sede_id y respuestas (array)');
        }
        if (respuestas.length === 0) {
            res.status(400);
            throw new Error('Debe proporcionar al menos una respuesta');
        }

        // Verificar que la sede existe
        const { data: sedeExiste, error: sedeError } = await supabase
            .from('sede')
            .select('id')
            .eq('id', sede_id)
            .is('fecha_eliminacion', null)
            .single();

        if (sedeError || !sedeExiste) {
            res.status(404);
            throw new Error('La sede especificada no existe');
        }

        // Validar formato de respuestas
        for (let i = 0; i < respuestas.length; i++) {
            const resp = respuestas[i];
            if (!resp.pregunta_id || !resp.valor_respuesta) {
                res.status(400);
                throw new Error(`Formato inválido de respuestas. La respuesta en posición ${i} debe tener pregunta_id y valor_respuesta`);
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
            // Rollback (delete created survey if answers fail)
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
        next(err);
    }
};

const getReporte = async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('respuesta')
            .select(`
                valor_respuesta,
                fecha_creacion,
                pregunta:pregunta_id (texto_pregunta),
                encuesta:encuesta_id (
                    sede:sede_id (
                        nombre,
                        filial:filial_id (
                            empresa:empresa_id (nombre),
                            pais:pais_id (nombre)
                        )
                    )
                )
            `)
            .order('fecha_creacion', { ascending: false });

        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createEncuesta,
    getReporte
};
