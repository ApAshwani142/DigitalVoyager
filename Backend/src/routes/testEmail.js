import express from "express";
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();

// Test email endpoint - for debugging
// This route handles POST /api/test-email
router.post("/", async (req, res) => {
  try {
    const { to } = req.body;
    const testEmail = to || process.env.EMAIL_USER;
    
    if (!testEmail) {
      return res.status(400).json({ 
        error: "No email address provided. Use ?to=your-email@example.com or set EMAIL_USER" 
      });
    }

    console.log("🧪 Testing email configuration...");
    console.log("🧪 EMAIL_USER:", process.env.EMAIL_USER ? "✅ Set" : "❌ Not set");
    console.log("🧪 EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Set" : "❌ Not set");
    console.log("🧪 EMAIL_HOST:", process.env.EMAIL_HOST || "Using default (smtp.gmail.com)");
    
    await sendEmail(
      testEmail,
      "Test Email from Digital Voyager",
      "This is a test email. If you receive this, your email configuration is working correctly!"
    );
    
    res.json({ 
      success: true, 
      message: `Test email sent successfully to ${testEmail}. Please check your inbox.` 
    });
  } catch (error) {
    console.error("❌ Test email failed:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: {
        code: error.code,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  }
});

export default router;

