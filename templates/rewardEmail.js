// templates/rewardEmail.js — builds the responsive HTML for the reward email.
function rewardEmailTemplate({ fullName }) {
  const firstName = (fullName || '').split(' ')[0] || 'there';
  const companyName = process.env.COMPANY_NAME || 'LaunchKit';
  const companyWebsite = process.env.COMPANY_WEBSITE || 'https://example.com';
  const supportEmail = process.env.SUPPORT_EMAIL || 'support@example.com';
  const rewardUrl = process.env.REWARD_DOWNLOAD_URL || 'https://example.com/downloads/reward.zip';
  const logoUrl = process.env.COMPANY_LOGO_URL || 'https://example.com/assets/logo.png';
  const twitterUrl = process.env.TWITTER_URL || 'https://twitter.com';
  const linkedinUrl = process.env.LINKEDIN_URL || 'https://linkedin.com';
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Your Free Reward Is Ready</title>
</head>
<body style="margin:0;padding:0;background-color:#12101C;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#12101C;padding:32px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:560px;background-color:#1B1730;border-radius:16px;overflow:hidden;" cellpadding="0" cellspacing="0">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding:32px 24px 8px;">
              <img src="${logoUrl}" width="120" alt="${companyName}" style="display:block;max-width:120px;" />
            </td>
          </tr>

          <!-- Hero -->
          <tr>
            <td align="center" style="padding:16px 32px 0;">
              <p style="margin:0;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:#FFC857;font-weight:bold;">It's ready</p>
              <h1 style="margin:12px 0 0;font-size:26px;line-height:1.25;color:#F5F3FF;">Your Free Reward Is Ready 🎉</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:20px 32px 8px;color:#D9D5EC;font-size:15px;line-height:1.6;">
              <p style="margin:0 0 16px;">Hi ${firstName},</p>
              <p style="margin:0 0 16px;">Thank you for requesting your free toolkit from ${companyName}. We're excited to help you get started — your download is ready right now.</p>
            </td>
          </tr>

          <!-- CTA button -->
          <tr>
            <td align="center" style="padding:16px 32px 32px;">
              <a href="${rewardUrl}" target="_blank" style="display:inline-block;background:linear-gradient(120deg,#7C5CFF,#FF7A59);color:#140F22;text-decoration:none;font-weight:bold;font-size:15px;padding:14px 32px;border-radius:999px;">
                Download Your Reward
              </a>
              <p style="margin:16px 0 0;font-size:12.5px;color:#9992B8;">
                Or copy this link: <a href="${rewardUrl}" style="color:#B8ACFF;">${rewardUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="border-top:1px solid rgba(245,243,255,0.1);"></td></tr>

          <!-- Footer info -->
          <tr>
            <td style="padding:24px 32px;color:#9992B8;font-size:13px;line-height:1.7;">
              <p style="margin:0 0 8px;">Questions? Reach us any time at <a href="mailto:${supportEmail}" style="color:#B8ACFF;">${supportEmail}</a>.</p>
              <p style="margin:0 0 16px;">Visit us at <a href="${companyWebsite}" style="color:#B8ACFF;">${companyWebsite}</a></p>
              <p style="margin:0 0 16px;">
                <a href="${twitterUrl}" style="color:#9992B8;text-decoration:underline;margin-right:12px;">Twitter</a>
                <a href="${linkedinUrl}" style="color:#9992B8;text-decoration:underline;">LinkedIn</a>
              </p>
              <p style="margin:0;color:#665F87;">&copy; ${year} ${companyName}. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

module.exports = rewardEmailTemplate;
