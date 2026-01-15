import nodemailer from "nodemailer";
import dns from "dns";
import { promisify } from "util";

const dnsLookup = promisify(dns.lookup);

const sendEmail = async (to, subject, message) => {
  // Check for email configuration
  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPass = process.env.EMAIL_PASS?.trim();
  const emailHost = process.env.EMAIL_HOST?.trim();
  
  // Check for email configuration - if not present, throw error (email is required)
  if (!emailUser || !emailPass) {
    const missing = [];
    if (!emailUser) missing.push("EMAIL_USER");
    if (!emailPass) missing.push("EMAIL_PASS");
    const errorMsg = `Email service not configured. Missing: ${missing.join(", ")}. Please configure EMAIL_USER and EMAIL_PASS in Render environment variables.`;
    console.error(`❌ ${errorMsg}`);
    throw new Error(errorMsg);
  }

  // Log that we're attempting to send email
  console.log(`📧 Attempting to send email to: ${to}`);
  console.log(`📧 Subject: ${subject}`);
  console.log(`📧 Using SMTP: ${emailHost || 'smtp.gmail.com (default)'}`);
  console.log(`📧 Email user: ${emailUser}`);
  console.log(`📧 Email host configured: ${emailHost || 'using default (smtp.gmail.com)'}`);
  console.log(`📧 Email pass length: ${emailPass ? emailPass.length : 0} characters`);
  console.log(`📧 Environment check - EMAIL_USER exists: ${!!emailUser}, EMAIL_PASS exists: ${!!emailPass}`);

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
      secure: true, // true for 465, false for other ports
      auth: {
        user: cleanEmailUser,
        pass: cleanEmailPass,
      },
      tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3',
      },
      connectionTimeout: 60000, // Increased to 60 seconds
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
      secure: false, // true for 465, false for other ports
      requireTLS: true,
      auth: {
        user: cleanEmailUser,
        pass: cleanEmailPass,
      },
      tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3',
      },
      connectionTimeout: 60000, // Increased to 60 seconds
      greetingTimeout: 30000,
      socketTimeout: 60000,
      pool: true,
      maxConnections: 1,
      maxMessages: 1,
    });
  };

  // Try port 25 as last resort (less secure but sometimes works)
  const tryPort25 = () => {
    console.log(`🔌 Attempting connection via port 25 (fallback)...`);
    return nodemailer.createTransport({
      host: smtpHost,
      port: 25,
      secure: false,
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
      return { ...info, emailSent: true };
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
      
      // Try port 25 as last resort
      try {
        return await attemptSend(tryPort25, "port 25 (fallback)");
      } catch (error25) {
        console.error(`❌ Port 25 failed:`, error25.code, error25.message);
        lastError = error25;
      }
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
    finalError.code === "ETIMEDOUT" ||
    finalError.message?.includes("timeout") ||
    finalError.message?.includes("ECONNREFUSED");

  let errorMsg;
  if (isAuthError) {
    errorMsg = `Gmail authentication failed (Code: ${finalError.code}). Please verify:
1. You're using a Gmail App Password (not your regular password)
2. 2-Step Verification is enabled on your Gmail account
3. The App Password is correct (16 characters, no spaces)
4. The EMAIL_USER matches the Gmail account that generated the App Password`;
  } else if (isTimeoutError) {
    errorMsg = `Cannot connect to Gmail SMTP server (Code: ${finalError.code}). This often happens on Render due to network restrictions. 
Solutions:
1. Check Render logs for detailed connection errors
2. Verify EMAIL_USER and EMAIL_PASS are set correctly in Render environment variables
3. Try using a different email service (SendGrid, Resend, or Mailgun) which work better with cloud platforms
4. Check if Gmail is blocking connections from Render's IP addresses`;
  } else {
    errorMsg = `Email sending failed: ${finalError.message || finalError.code || "Unknown error"}. Error code: ${finalError.code || "N/A"}`;
  }

  console.error("❌ All SMTP connection attempts failed");
  console.error("❌ Final error:", errorMsg);
  console.error("❌ Error details:", JSON.stringify(finalError, null, 2));
  throw new Error(errorMsg);
};

export default sendEmail;
