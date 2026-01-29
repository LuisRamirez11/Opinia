const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.get('/', async(req, res) => {
    try{
        const { data, error } = await supabase
        .from('filial')
        .select('id');
        
    } catch(err) {

    }
});

module.exports = router;