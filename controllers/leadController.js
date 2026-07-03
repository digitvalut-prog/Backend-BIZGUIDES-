// controllers/leadController.js
const LeadModel = require('../models/leadModel');
const { sendRewardEmail } = require('../services/emailService');
const logger = require('../utils/logger');

async function createLead(req, res, next) {
  const { fullName, email, company } = req.body;

  try {
    // Explicit duplicate check for a clean 409 response
    // (the DB unique constraint is the authoritative safety net).
    const existing = await LeadModel.findByEmail(email);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'This email has already claimed the reward.',
      });
    }

    const lead = await LeadModel.create({
      fullName,
      email,
      company,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    // Send the reward email immediately. If it fails, the lead is
    // still saved — we log the failure rather than losing the submission.
    let emailSent = true;
    try {
      await sendRewardEmail({ fullName: lead.full_name, email: lead.email });
    } catch (emailErr) {
      emailSent = false;
      logger.error(`Lead ${lead.id} saved but reward email failed: ${emailErr.message}`);
    }

    return res.status(201).json({
      success: true,
      message: emailSent
        ? 'Success! Check your inbox for your reward.'
        : 'Your submission was saved. We had trouble sending the email — our team will follow up.',
      data: { id: lead.id, fullName: lead.full_name, email: lead.email },
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'This email has already claimed the reward.',
      });
    }
    next(err);
  }
}

module.exports = { createLead };
