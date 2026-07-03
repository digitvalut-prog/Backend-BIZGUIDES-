// middleware/validateLead.js — validates and sanitizes incoming lead data
const { body, validationResult } = require('express-validator');
const xss = require('xss');

const validateLead = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required.')
    .isLength({ min: 2, max: 150 })
    .withMessage('Full name must be between 2 and 150 characters.')
    .customSanitizer((value) => xss(value)),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .isLength({ max: 255 })
    .withMessage('Email is too long.')
    .normalizeEmail(),

  body('company')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 150 })
    .withMessage('Company name is too long.')
    .customSanitizer((value) => xss(value)),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }
    next();
  },
];

module.exports = validateLead;
