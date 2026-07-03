// routes/admin.js — protected admin endpoints
const express = require('express');
const router = express.Router();

const { listLeads, deleteLead } = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');

router.use(adminAuth);

// GET /api/admin/leads
router.get('/leads', listLeads);

// DELETE /api/admin/leads/:id
router.delete('/leads/:id', deleteLead);

module.exports = router;
