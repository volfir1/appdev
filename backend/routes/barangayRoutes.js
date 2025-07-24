const express = require('express');
const router = express.Router();
const barangayController = require('../controllers/barangayController');
const auth = require('../utils/middleware');

// You may want to allow only admin for create, update, delete
router.post('/', auth, barangayController.createBarangay);
router.get('/', auth, barangayController.getBarangays);
router.get('/:id', auth, barangayController.getBarangayById);
router.put('/:id', auth, barangayController.updateBarangay);
router.delete('/:id', auth, barangayController.deleteBarangay);
router.get('/geospatial/summary', auth, barangayController.getBarangayGeospatialSummary);

module.exports = router;
