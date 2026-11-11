import nodemailer from "nodemailer";

export async function sendEmailOtp(email: string, otp: string, userName?: string): Promise<boolean> {
  const host = process.env.MAIL_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.MAIL_PORT || "465", 10);
  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_PASSWORD;
  
  // Sender display name must explicitly be "TIKORA Security"
  const fromEmail = user || process.env.MAIL_FROM || "security@tikora.com";
  const from = `"TIKORA Security" <${fromEmail}>`;

  if (!user || !pass) {
    console.log(`[MAILER] No mail credentials configured. OTP for ${email}: ${otp}`);
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-block; padding: 6px 14px; background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 9999px; color: #b45309; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">
            🛡️ TIKORA Security
          </div>
          <h1 style="color: #0f172a; font-size: 22px; font-weight: 800; margin: 16px 0 6px; letter-spacing: -0.5px;">
            Password Reset Verification
          </h1>
          <p style="color: #64748b; font-size: 13px; margin: 0;">
            Secure 6-digit one-time authorization code
          </p>
        </div>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px 20px; margin-bottom: 24px;">
          <p style="color: #334155; font-size: 14px; margin: 0 0 10px; line-height: 1.5;">
            Hello <strong>${userName || "User"}</strong>,
          </p>
          <p style="color: #64748b; font-size: 13px; margin: 0; line-height: 1.5;">
            You requested to reset your TIKORA account password. Please enter the following 6-digit verification code to complete the process:
          </p>
        </div>

        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 14px; padding: 24px; text-align: center; margin: 24px 0; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.15);">
          <div style="font-size: 11px; font-weight: 700; color: #f59e0b; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;">
            Your Verification Code
          </div>
          <div style="font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 900; letter-spacing: 10px; color: #ffffff; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
            ${otp}
          </div>
          <div style="font-size: 11px; color: #94a3b8; margin-top: 8px;">
            ⏱️ Valid for 15 minutes only
          </div>
        </div>

        <div style="border-top: 1px solid #f1f5f9; padding-top: 16px; margin-top: 24px; color: #94a3b8; font-size: 11px; line-height: 1.5; text-align: center;">
          <p style="margin: 0 0 6px;">
            If you did not request this password reset, please ignore this email or contact support if you have concerns.
          </p>
          <p style="margin: 0; font-weight: 600; color: #64748b;">
            © ${new Date().getFullYear()} TIKORA Security Team. All rights reserved.
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from,
      to: email,
      subject: `TIKORA Security - Verification Code: ${otp}`,
      text: `TIKORA Security: Your 6-digit password reset verification code is: ${otp}. It will expire in 15 minutes.`,
      html,
    });

    console.log(`[MAILER] ✅ TIKORA Security email successfully dispatched to ${email}`);
    return true;
  } catch (err: any) {
    console.warn(`[MAILER] ⚠️ Could not send email via SMTP (${err?.message || err}). OTP logged to console.`);
    return false;
  }
}

/**
 * Dispatches an official payout notification email to a provider when admin transfers their earnings via Chapa/Bank.
 */
export async function sendPayoutNotificationEmail({
  email,
  providerName,
  amount,
  remainingBalance,
  reference,
  channel = "Chapa",
}: {
  email: string;
  providerName: string;
  amount: number;
  remainingBalance: number;
  reference: string;
  channel?: string;
}): Promise<boolean> {
  const host = process.env.MAIL_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.MAIL_PORT || "465", 10);
  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_PASSWORD;

  const fromEmail = user || process.env.MAIL_FROM || "finance@tikora.com";
  const from = `"TIKORA Finance" <${fromEmail}>`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 32px 24px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; padding: 6px 14px; background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 9999px; color: #047857; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">
          💸 TIKORA Financial Settlement
        </div>
        <h1 style="color: #0f172a; font-size: 22px; font-weight: 800; margin: 16px 0 6px; letter-spacing: -0.5px;">
          ክፍያ ተላልፏል / Payout Dispatched
        </h1>
        <p style="color: #64748b; font-size: 13px; margin: 0;">
          ከ TIKORA ፕላትፎርም የተላከ የትኬት ሽያጭ የተጣራ ገቢ ማሳወቂያ
        </p>
      </div>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px 20px; margin-bottom: 20px;">
        <p style="color: #334155; font-size: 14px; margin: 0 0 10px; line-height: 1.5;">
          ሰላም <strong>${providerName}</strong>,
        </p>
        <p style="color: #64748b; font-size: 13px; margin: 0; line-height: 1.5;">
          አድሚን የትኬት ሽያጭ የተጣራ ገቢህን ከፕላትፎርሙ በ <strong>${channel}</strong> አስተላልፎልሃል።
          (Admin has successfully transferred your ticket net earnings of <strong>${amount.toLocaleString()} ETB</strong> from the TIKORA platform.)
        </p>
      </div>

      <div style="background: linear-gradient(135deg, #065f46 0%, #047857 100%); border-radius: 14px; padding: 24px; text-align: center; margin: 20px 0; box-shadow: 0 10px 25px -5px rgba(6, 95, 70, 0.25);">
        <div style="font-size: 11px; font-weight: 700; color: #a7f3d0; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;">
          የተላከው ገንዘብ / Transferred Amount
        </div>
        <div style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 900; color: #ffffff; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
          ${amount.toLocaleString()} ETB
        </div>
        <div style="font-size: 11px; color: #d1fae5; margin-top: 8px;">
          ክፍያ ዘዴ / Channel: ${channel} • Ref: ${reference}
        </div>
      </div>

      <div style="border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px 20px; margin-bottom: 24px; background-color: #fcfcfd;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">ከፕላትፎርሙ የተላከለት ገንዘብ:</td>
            <td style="padding: 8px 0; font-weight: 700; color: #047857; text-align: right; border-bottom: 1px solid #f1f5f9;">${amount.toLocaleString()} ETB</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">በፕላትፎርሙ የቀረ ቀሪ ሂሳብ (Remaining):</td>
            <td style="padding: 8px 0; font-weight: 700; color: #0f172a; text-align: right;">${remainingBalance.toLocaleString()} ETB</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin: 24px 0;">
        <a href="http://localhost:3000/provider/payments" style="display: inline-block; padding: 12px 28px; background-color: #d97706; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 13px; border-radius: 12px; box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);">
          View Financial Settlement in Portal
        </a>
      </div>

      <div style="border-top: 1px solid #f1f5f9; padding-top: 16px; margin-top: 24px; color: #94a3b8; font-size: 11px; line-height: 1.5; text-align: center;">
        <p style="margin: 0 0 6px;">
          ይህ ኢሜይል የተላከው ከ TIKORA Financial Settlement ስርዓት ነው።
        </p>
        <p style="margin: 0; font-weight: 600; color: #64748b;">
          © ${new Date().getFullYear()} TIKORA Security & Finance. All rights reserved.
        </p>
      </div>
    </div>
  `;

  if (!user || !pass) {
    console.log(`[PAYOUT MAILER] 💸 Simulated Payout Email for ${email}: ${amount} ETB dispatched (Remaining: ${remainingBalance} ETB)`);
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    });

    await transporter.sendMail({
      from,
      to: email,
      subject: `TIKORA Finance - ክፍያ ተላልፏል / Payout Dispatched: ${amount.toLocaleString()} ETB`,
      text: `ሰላም ${providerName}: ከ TIKORA ፕላትፎርም ${amount.toLocaleString()} ETB ተልኮልሃል። በፕላትፎርሙ የቀረ ቀሪ ሂሳብ: ${remainingBalance.toLocaleString()} ETB። Ref: ${reference}`,
      html,
    });

    console.log(`[PAYOUT MAILER] ✅ TIKORA Finance payout email successfully dispatched to ${email}`);
    return true;
  } catch (err: any) {
    console.warn(`[PAYOUT MAILER] ⚠️ Could not send email via SMTP (${err?.message || err}).`);
    return false;
  }
}
