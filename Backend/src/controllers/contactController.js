import { validationResult } from "express-validator";
import sendEmail from "../utils/sendEmail.js";

export const sendContactMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, phone, message, subject } = req.body;
    const targetEmail = process.env.CONTACT_EMAIL || "info@dgvoyager.com";

    const emailSubject =
      subject && subject.trim() !== ""
        ? `Contact Form: ${subject}`
        : `New Contact Form Submission`;

    const emailBody = `
New contact form submission:

Name: ${name}
Email: ${email}
Phone: ${phone || "N/A"}
Subject: ${subject || "N/A"}

Message:
${message}
`;

    await sendEmail(targetEmail, emailSubject, emailBody);

    return res
      .status(200)
      .json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending contact form email:", error.message);
    return res
      .status(500)
      .json({ success: false, error: "Failed to send message" });
  }
};
