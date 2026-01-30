const supabase = require('../config/supabase');

const getEmpresas = async (req, res, next) => {
    try {
        const { pais_id } = req.query;        

        if (pais_id) {            
            const { data: filiales, error: filialesError } = await supabase
                .from('filial')
                .select(`
                    empresa:empresa_id (
                        id,
                        nombre,
                        fecha_creacion
                    )
                `)
                .eq('pais_id', pais_id)
                .is('fecha_eliminacion', null)
                .order('empresa(nombre)');

            if (filialesError) throw filialesError;
            const empresas = filiales.map(filial => filial.empresa);            
            return res.status(200).json(empresas);
        }
        
        // If no pais_id, maybe return all? Keeping existing logic return nothing/undefined for now if not specified in original
        // Looking at original code, it only returned if pais_id was present.
        // But let's add a default return to avoid hanging if someone calls without pais_id
         res.status(200).json([]);

    } catch (err) {
        next(err);
    }
};

const createEmpresa = async (req, res, next) => {
    try {
        const { nombre } = req.body;
        if (!nombre || nombre.trim() === '') {
            res.status(400);
            throw new Error('El nombre de la empresa es requerido');
        }
        const { data, error } = await supabase
            .from('empresa')
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
    getEmpresas,
    createEmpresa
};
