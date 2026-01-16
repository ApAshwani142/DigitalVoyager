import { Resend } from "resend";
import nodemailer from "nodemailer";
import dns from "dns";
import { promisify } from "util";

const dnsLookup = promisify(dns.lookup);

const sendEmail = async (to, subject, message) => {
  // Check for Resend API key first (recommended for cloud platforms like Render)
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  
  if (resendApiKey) {
    // Use Resend API (works perfectly on Render and other cloud platforms)
    try {
      console.log(`📧 Using Resend API to send email to: ${to}`);
      console.log(`📧 Subject: ${subject}`);
      
      const resend = new Resend(resendApiKey);
      
      // Get the from email - use RESEND_FROM_EMAIL or default to Resend's verified domain
      // IMPORTANT: Do NOT use EMAIL_USER here as it might be a Gmail address which requires domain verification
      // Use onboarding@resend.dev (Resend's default verified domain) or your own verified domain via RESEND_FROM_EMAIL
      const fromEmail = process.env.RESEND_FROM_EMAIL?.trim() || "onboarding@resend.dev";
      
      const { data, error } = await resend.emails.send({
        from: `Digital Voyager <${fromEmail}>`,
        to: [to],
        subject: subject,
        html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Digital Voyager</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            ${message.replace(/\n/g, "<br>")}
          </div>
          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
            <p>This is an automated message from Digital Voyager.</p>
          </div>
        </div>`,
        text: message,
      });

      if (error) {
        console.error("❌ Resend API error:", error);
        throw new Error(`Resend API error: ${error.message || JSON.stringify(error)}`);
      }

      console.log(`✅ Email sent successfully via Resend to ${to}`);
      console.log(`✅ Email ID: ${data?.id}`);
      return { messageId: data?.id, emailSent: true, service: 'resend' };
    } catch (error) {
      console.error("❌ Resend email failed:", error.message);
      throw new Error(`Failed to send email via Resend: ${error.message}`);
    }
  }

  // Fallback to Gmail SMTP (may not work on Render due to network restrictions)
  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPass = process.env.EMAIL_PASS?.trim();
  const emailHost = process.env.EMAIL_HOST?.trim();
  
  if (!emailUser || !emailPass) {
    const errorMsg = `Email service not configured. Please set either:
1. RESEND_API_KEY (recommended for cloud platforms like Render) - Get free API key at https://resend.com
2. EMAIL_USER and EMAIL_PASS (Gmail SMTP - may not work on Render due to network restrictions)

For Render hosting, Resend is strongly recommended as Gmail SMTP connections are often blocked.`;
    console.error(`❌ ${errorMsg}`);
    throw new Error(errorMsg);
  }

  console.log(`📧 Using Gmail SMTP to send email to: ${to}`);
  console.log(`📧 Subject: ${subject}`);
  console.log(`📧 Using SMTP: ${emailHost || 'smtp.gmail.com (default)'}`);
  console.log(`⚠️ Note: Gmail SMTP may not work on Render due to network restrictions. Consider using Resend API instead.`);

  const smtpHost = emailHost && emailHost.includes(".") ? emailHost : "smtp.gmail.com";

  try {
    await dnsLookup(smtpHost);
  } catch (dnsError) {
    throw new Error(
      `Cannot resolve hostname ${smtpHost}. Check your internet connection and DNS settings.`
    );
  }

  // Clean up email password (remove any whitespace)
  const cleanEmailPass = String(emailPass).trim().replace(/\s+/g, "");
  const cleanEmailUser = String(emailUser).trim();

  const tryPort465 = () => {
    console.log(`🔌 Attempting connection via port 465 (SSL)...`);
    return nodemailer.createTransport({
      host: smtpHost,
      port: 465,
      secure: true,
      auth: {
        user: cleanEmailUser,
        pass: cleanEmailPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
      pool: true,
      maxConnections: 1,
      maxMessages: 1,
    });
  };

  const tryPort587 = () => {
    console.log(`🔌 Attempting connection via port 587 (TLS)...`);
    return nodemailer.createTransport({
      host: smtpHost,
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: cleanEmailUser,
        pass: cleanEmailPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
      pool: true,
      maxConnections: 1,
      maxMessages: 1,
    });
  };

  const mailOptions = {
    from: `"Digital Voyager" <${cleanEmailUser}>`,
    to,
    subject,
    text: message,
    html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      ${message.replace(/\n/g, "<br>")}
    </div>`,
  };

  const attemptSend = async (createTransporter, portName) => {
    let trans;
    try {
      trans = createTransporter();
      
      // Verify connection first
      console.log(`🔍 Verifying SMTP connection for ${portName}...`);
      await trans.verify();
      console.log(`✅ SMTP connection verified for ${portName}`);
      
      // Send email with longer timeout
      console.log(`📤 Sending email via ${portName}...`);
      const info = await Promise.race([
        trans.sendMail(mailOptions),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Send timeout after 60 seconds")), 60000)
        ),
      ]);

      console.log(`✅ Email sent successfully to ${to} via ${portName}`);
      console.log(`✅ Message ID: ${info.messageId}`);
      if (trans.close) trans.close();
      return { ...info, emailSent: true, service: 'smtp' };
    } catch (err) {
      console.error(`❌ Error on ${portName}:`, err.code, err.message);
      if (trans && trans.close) trans.close();
      throw err;
    }
  };

  // Try multiple ports with detailed error logging
  let lastError = null;
  
  // Try port 465 first (SSL)
  try {
    return await attemptSend(tryPort465, "port 465 (SSL)");
  } catch (error465) {
    console.error(`❌ Port 465 failed:`, error465.code, error465.message);
    lastError = error465;
    
    // Try port 587 (TLS)
    try {
      return await attemptSend(tryPort587, "port 587 (TLS)");
    } catch (error587) {
      console.error(`❌ Port 587 failed:`, error587.code, error587.message);
      lastError = error587;
    }
  }

  // All ports failed - provide detailed error message
  const finalError = lastError;
  const isAuthError =
    finalError.code === "EAUTH" ||
    finalError.message?.includes("authentication") ||
    finalError.message?.includes("Invalid login") ||
    finalError.message?.includes("Username and Password not accepted");
    
  const isTimeoutError =
    finalError.code === "ETIMEDOUT" ||
    finalError.code === "ECONNREFUSED" ||
    finalError.message?.includes("timeout") ||
    finalError.message?.includes("ECONNREFUSED");

  let errorMsg;
  if (isAuthError) {
    errorMsg = `Gmail authentication failed (Code: ${finalError.code}). Please verify:
1. You're using a Gmail App Password (not your regular password)
2. 2-Step Verification is enabled on your Gmail account
3. The App Password is correct (16 characters, no spaces)
4. The EMAIL_USER matches the Gmail account that generated the App Password

RECOMMENDED: Switch to Resend API (free, works on Render). Get API key at https://resend.com`;
  } else if (isTimeoutError) {
    errorMsg = `Cannot connect to Gmail SMTP server (Code: ${finalError.code}). 

⚠️ Render blocks outbound SMTP connections to Gmail. This is why you're getting ETIMEDOUT errors.

✅ SOLUTION: Use Resend API instead (works perfectly on Render):
1. Sign up for free at https://resend.com (3,000 emails/month free)
2. Get your API key from Resend dashboard
3. Set RESEND_API_KEY in Render environment variables
4. Optionally set RESEND_FROM_EMAIL (or it will use your EMAIL_USER)
5. Redeploy your backend

Resend is modern, reliable, and designed for cloud platforms like Render.`;
  } else {
    errorMsg = `Email sending failed: ${finalError.message || finalError.code || "Unknown error"}. Error code: ${finalError.code || "N/A"}

RECOMMENDED: Switch to Resend API for reliable email delivery on Render.`;
  }

  console.error("❌ All SMTP connection attempts failed");
  console.error("❌ Final error:", errorMsg);
  console.error("❌ Error details:", JSON.stringify(finalError, null, 2));
  throw new Error(errorMsg);
};

export default sendEmail;
