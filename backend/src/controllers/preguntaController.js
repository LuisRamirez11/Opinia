const supabase = require('../config/supabase');

const getPreguntas = async (req, res, next) => {
    try {
        const { empresa_id } = req.query;  
        if (!empresa_id) {
            res.status(400);
            throw new Error('El parámetro empresa_id es requerido');
        }

        const { data: empresaExiste, error: empresaError } = await supabase
            .from('empresa')
            .select('id')
            .eq('id', empresa_id)
            .is('fecha_eliminacion', null)
            .single();

        if (empresaError || !empresaExiste) {
            res.status(404);
            throw new Error('La empresa especificada no existe');
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
        next(err);
    }
};

const createPregunta = async (req, res, next) => {
    try {
        const { empresa_id, texto_pregunta, tipo_respuesta, orden, activo } = req.body;
        if (!empresa_id || !texto_pregunta) {
            res.status(400);
            throw new Error('Se requieren empresa_id y texto_pregunta');
        } 
        
        if (texto_pregunta.trim() === '') {
            res.status(400);
            throw new Error('El texto de la pregunta no puede estar vacío');
        }

        const { data: empresaExiste, error: empresaError } = await supabase
            .from('empresa')
            .select('id')
            .eq('id', empresa_id)
            .is('fecha_eliminacion', null)
            .single();

        if (empresaError || !empresaExiste) {
            res.status(404);
            throw new Error('La empresa especificada no existe');
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
        next(err);
    }
};

module.exports = {
    getPreguntas,
    createPregunta
};
