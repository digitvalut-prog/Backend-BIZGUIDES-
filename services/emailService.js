// services/emailService.js — sends the reward email via Nodemailer/SMTP
const nodemailer = require('nodemailer');
const rewardEmailTemplate = require('../templates/rewardEmail');
const logger = require('../utils/logger');

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  return transporter;
}

/**
 * Sends the "Your Free Reward Is Ready" email to a new lead.
 * Throws on failure so the caller can decide how to respond.
 */
async function sendRewardEmail({ fullName, email }) {
  const fromName = process.env.EMAIL_FROM_NAME || 'LaunchKit';
  const fromAddress = process.env.EMAIL_FROM_ADDRESS || process.env.SMTP_USER;

  const mailOptions = {
    from: `"${fromName}" <${fromAddress}>`,
    to: email,
    subject: 'Your Free Reward Is Ready 🎉',
    html: rewardEmailTemplate({ fullName }),
    text: `Hi ${fullName.split(' ')[0]}, your free reward is ready! Download it here: ${process.env.REWARD_DOWNLOAD_URL}`,
  };

  try {
    const info = await getTransporter().sendMail(mailOptions);
    logger.info(`Reward email sent to ${email} (messageId: ${info.messageId})`);
    return info;
  } catch (err) {
    logger.error(`Failed to send reward email to ${email}: ${err.message}`);
    throw err;
  }
}

module.exports = { sendRewardEmail };
