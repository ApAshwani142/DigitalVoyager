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
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000,
      disableFileAccess: true,
      disableUrlAccess: true,
    });
  };

  const tryPort587 = () => {
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
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000,
      disableFileAccess: true,
      disableUrlAccess: true,
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
    const trans = createTransporter();
    try {
      const info = await Promise.race([
        trans.sendMail(mailOptions),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Send timeout after 30 seconds")), 30000)
        ),
      ]);

      console.log(`✅ Email sent successfully to ${to} via ${portName}`);
      console.log(`✅ Message ID: ${info.messageId}`);
      trans.close();
      return { ...info, emailSent: true };
    } catch (err) {
      trans.close();
      throw err;
    }
  };

  try {
    return await attemptSend(tryPort465, "port 465");
  } catch (error465) {
    try {
      return await attemptSend(tryPort587, "port 587");
    } catch (error587) {
      const isAuthError =
        error587.code === "EAUTH" ||
        error587.message.includes("authentication") ||
        error587.message.includes("Invalid login");
      const isTimeoutError =
        error587.code === "ETIMEDOUT" ||
        error587.code === "ECONNREFUSED" ||
        error587.message.includes("timeout");

      let errorMsg;
      if (isAuthError) {
        errorMsg =
          "Gmail authentication failed. Please verify your App Password and 2-Step Verification settings.";
      } else if (isTimeoutError) {
        errorMsg =
          "Cannot connect to Gmail SMTP server. Check your firewall and network settings.";
      } else {
        errorMsg = `Email sending failed: ${error587.message || error587.code || "Unknown error"}`;
      }

      console.error("Error sending email:", errorMsg);
      throw new Error(errorMsg);
    }
  }
};

export default sendEmail;
