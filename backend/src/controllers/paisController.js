const supabase = require('../config/supabase');

const getPaises = async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('pais')
            .select('id, nombre')
            .is('fecha_eliminacion', null)
            .order('nombre');

        if (error) throw error;
        
        res.status(200).json(data);
    } catch (err) {
        next(err);
    }
};

const createPais = async (req, res, next) => {
    try {
        const { nombre } = req.body;        
        if (!nombre || nombre.trim() === '') {
            res.status(400);
            throw new Error('El nombre del país es requerido');
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
        next(err);
    }
};

module.exports = {
    getPaises,
    createPais
};
