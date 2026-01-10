// Test email configuration
import dotenv from "dotenv";
dotenv.config();
import sendEmail from "./src/utils/sendEmail.js";

const testEmail = async () => {
  console.log("🧪 Testing email configuration...\n");
  
  try {
    await sendEmail(
      "test@example.com", // Replace with your email
      "Test Email from Digital Voyager",
      "This is a test email to verify email configuration."
    );
    console.log("\n✅ Email test successful!");
  } catch (error) {
    console.error("\n❌ Email test failed:", error.message);
    console.error("Full error:", error);
  }
};

testEmail();

