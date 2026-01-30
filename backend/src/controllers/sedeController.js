const supabase = require('../config/supabase');

const getSedes = async (req, res, next) => {
    try {
        const { pais_id, empresa_id } = req.query;

        let query = supabase
            .from('sede')
            .select(`
                id,
                nombre,
                filial_id,
                filial:filial_id (
                    id,
                    empresa:empresa_id (id, nombre),
                    pais:pais_id (id, nombre)
                )
            `)
            .is('fecha_eliminacion', null);

        // Optimization: Filter at database level if possible, 
        // however Supabase nested filtering can be tricky.
        // filtering on referenced tables:
        // .eq('filial.pais_id', pais_id) is not directly supported in simple syntax usually without specific setup or inner joining mechanics.
        // But for "minimalist" approach, if the relationships are standard, we can use !inner to enforce it.
        // Let's stick to the JavaScript filtering for now to ensure we don't break functionality 
        // unless we are sure about the complex query syntax, OR we create a specific RPC / View.
        // Wait, the user asked for "minimalist" and "professional".
        // Filtering in JS for large datasets is bad. 
        // Correct supabase way for deep filtering:
        // .not('filial', 'is', null) // if we did inner join logic
        
        // Given I cannot easily test the deep filtering syntax without a running instance, I will stick to the previous logic BUT ensure it is clean.
        // Actually, let's keep it safe.

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

        // Sort by name
        sedesFiltradas.sort((a, b) => a.nombre.localeCompare(b.nombre));
        
        res.status(200).json(sedesFiltradas);

    } catch (err) {
        next(err);
    }
};

module.exports = {
    getSedes
};
