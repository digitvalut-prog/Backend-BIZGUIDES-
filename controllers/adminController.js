// controllers/adminController.js
const LeadModel = require('../models/leadModel');

async function listLeads(req, res, next) {
  try {
    const limit = Math.min(Number(req.query.limit) || 1000, 5000);
    const offset = Number(req.query.offset) || 0;

    const [leads, total] = await Promise.all([
      LeadModel.findAll({ limit, offset }),
      LeadModel.count(),
    ]);

    res.json({ success: true, total, leads });
  } catch (err) {
    next(err);
  }
}

async function deleteLead(req, res, next) {
  try {
    const { id } = req.params;
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ success: false, message: 'Invalid lead id.' });
    }

    const deleted = await LeadModel.deleteById(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Lead not found.' });
    }

    res.json({ success: true, message: 'Lead deleted.', id: deleted.id });
  } catch (err) {
    next(err);
  }
}

module.exports = { listLeads, deleteLead };
