const express = require('express');
const router = express.Router();
const { getSedes } = require('../controllers/sedeController');

router.get('/', getSedes);

module.exports = router;