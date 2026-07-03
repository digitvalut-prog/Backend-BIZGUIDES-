// routes/leads.js — public lead-submission endpoint
const express = require('express');
const router = express.Router();

const { createLead } = require('../controllers/leadController');
const validateLead = require('../middleware/validateLead');
const { leadRateLimiter } = require('../middleware/rateLimiter');

// POST /api/leads
router.post('/', leadRateLimiter, validateLead, createLead);

module.exports = router;
