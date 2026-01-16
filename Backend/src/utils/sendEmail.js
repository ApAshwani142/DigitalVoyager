import { Resend } from "resend";
import nodemailer from "nodemailer";
import dns from "dns";
import { promisify } from "util";

const dnsLookup = promisify(dns.lookup);

const sendEmail = async (to, subject, message) => {
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  
  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
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
        console.error("Resend API error:", error);
        throw new Error(`Resend API error: ${error.message || JSON.stringify(error)}`);
      }

      console.log(`Email sent successfully to ${to} via Resend`);
      return { messageId: data?.id, emailSent: true, service: 'resend' };
    } catch (error) {
      console.error("Failed to send email via Resend:", error.message);
      throw new Error(`Failed to send email via Resend: ${error.message}`);
    }
  }

  // Fallback to Gmail SMTP
  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPass = process.env.EMAIL_PASS?.trim();
  const emailHost = process.env.EMAIL_HOST?.trim();
  
  if (!emailUser || !emailPass) {
    const errorMsg = "Email service not configured. Please set RESEND_API_KEY or EMAIL_USER and EMAIL_PASS.";
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  const smtpHost = emailHost && emailHost.includes(".") ? emailHost : "smtp.gmail.com";

  try {
    await dnsLookup(smtpHost);
  } catch (dnsError) {
    throw new Error(`Cannot resolve hostname ${smtpHost}. Check your DNS settings.`);
  }

  const cleanEmailPass = String(emailPass).trim().replace(/\s+/g, "");
  const cleanEmailUser = String(emailUser).trim();

  const createTransporter465 = () => {
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
    });
  };

  const createTransporter587 = () => {
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

  const attemptSend = async (createTransporter) => {
    let trans;
    try {
      trans = createTransporter();
      await trans.verify();
      
      const info = await Promise.race([
        trans.sendMail(mailOptions),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Send timeout after 60 seconds")), 60000)
        ),
      ]);

      console.log(`Email sent successfully to ${to}`);
      if (trans.close) trans.close();
      return { ...info, emailSent: true, service: 'smtp' };
    } catch (err) {
      console.error("SMTP error:", err.code, err.message);
      if (trans && trans.close) trans.close();
      throw err;
    }
  };

  let lastError = null;
  
  try {
    return await attemptSend(createTransporter465);
  } catch (error465) {
    lastError = error465;
    try {
      return await attemptSend(createTransporter587);
    } catch (error587) {
      lastError = error587;
    }
  }

  const finalError = lastError;
  const isAuthError =
    finalError.code === "EAUTH" ||
    finalError.message?.includes("authentication") ||
    finalError.message?.includes("Invalid login");
    
  const isTimeoutError =
    finalError.code === "ETIMEDOUT" ||
    finalError.code === "ECONNREFUSED" ||
    finalError.message?.includes("timeout");

  let errorMsg;
  if (isAuthError) {
    errorMsg = `Gmail authentication failed. Please verify your credentials.`;
  } else if (isTimeoutError) {
    errorMsg = `Cannot connect to Gmail SMTP server. Consider using Resend API instead.`;
  } else {
    errorMsg = `Email sending failed: ${finalError.message || "Unknown error"}`;
  }

  console.error("All SMTP connection attempts failed:", errorMsg);
  throw new Error(errorMsg);
};

export default sendEmail;
