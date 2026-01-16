import express from "express";
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { to } = req.body;
    const testEmail = to || process.env.EMAIL_USER;
    
    if (!testEmail) {
      return res.status(400).json({ 
        error: "No email address provided" 
      });
    }

    await sendEmail(
      testEmail,
      "Test Email from Digital Voyager",
      "This is a test email. If you receive this, your email configuration is working correctly!"
    );
    
    res.json({ 
      success: true, 
      message: `Test email sent successfully to ${testEmail}` 
    });
  } catch (error) {
    console.error("Test email failed:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message
    });
  }
});

export default router;

