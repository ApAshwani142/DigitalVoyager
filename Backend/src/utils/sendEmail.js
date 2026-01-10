import nodemailer from "nodemailer";
import dns from "dns";
import { promisify } from "util";

const dnsLookup = promisify(dns.lookup);

const sendEmail = async (to, subject, message) => {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    const missing = [];
    if (!process.env.EMAIL_HOST) missing.push("EMAIL_HOST");
    if (!process.env.EMAIL_USER) missing.push("EMAIL_USER");
    if (!process.env.EMAIL_PASS) missing.push("EMAIL_PASS");
    throw new Error(`Email service not configured. Missing: ${missing.join(", ")}`);
  }

  const emailHost = process.env.EMAIL_HOST.trim();
  const smtpHost = emailHost && emailHost.includes(".") ? emailHost : "smtp.gmail.com";

  try {
    await dnsLookup(smtpHost);
  } catch (dnsError) {
    throw new Error(
      `Cannot resolve hostname ${smtpHost}. Check your internet connection and DNS settings.`
    );
  }

  const emailPass = String(process.env.EMAIL_PASS).trim().replace(/\s+/g, "");

  const tryPort465 = () => {
    return nodemailer.createTransport({
      host: smtpHost,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER.trim(),
        pass: emailPass,
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
        user: process.env.EMAIL_USER.trim(),
        pass: emailPass,
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
    from: `"Digital Voyager" <${process.env.EMAIL_USER.trim()}>`,
    to,
    subject,
    text: message,
    html: message.replace(/\n/g, "<br>"),
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

      console.log(`Email sent successfully to ${to} via ${portName}`);
      trans.close();
      return info;
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
