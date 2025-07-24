const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');
const auth = require('../utils/middleware');

// CSV and PDF report endpoints
router.get('/poverty/csv', auth, reportsController.downloadPovertyReport);
router.get('/poverty/pdf', auth, reportsController.downloadPovertyReportPDF);

module.exports = router;
