import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

const otpStore = {};

export const sendOtp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, otp } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "User already exists" });
    }

    if (!otp) {
      return res.status(400).json({ msg: "OTP is required" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const normalizedOtp = String(otp).trim().replace(/\D/g, "");
    const normalizedEmail = String(email).trim().toLowerCase();

    otpStore[normalizedEmail] = {
      otp: normalizedOtp,
      expires: Date.now() + 5 * 60 * 1000,
      userData: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
      },
    };

    try {
      await sendEmail(
        normalizedEmail,
        "OTP for Digital Voyager Registration",
        `Hello ${name},\n\nYour OTP for Digital Voyager registration is: ${normalizedOtp}\n\nThis OTP is valid for 5 minutes.\n\nIf you didn't request this, please ignore this email.`
      );
      console.log("OTP email sent to:", normalizedEmail);
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError.message);
      return res.status(500).json({
        msg: `Failed to send OTP email: ${emailError.message}`,
        error: emailError.message,
      });
    }

    return res.status(200).json({ msg: "OTP sent successfully" });
  } catch (err) {
    console.error("Send OTP error:", err.message);
    return res.status(500).send("Server error");
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ msg: "Email and OTP are required" });
  }

  try {
    const normalizedOtp = String(otp).trim().replace(/\D/g, "");

    if (!normalizedOtp || normalizedOtp.length !== 6) {
      return res.status(400).json({ msg: "Invalid OTP format. Must be 6 digits." });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const otpData = otpStore[normalizedEmail];

    if (!otpData) {
      return res.status(400).json({ msg: "OTP not found. Please request a new OTP." });
    }

    const storedOtp = String(otpData.otp).trim().replace(/\D/g, "");

    if (otpData.expires < Date.now()) {
      delete otpStore[normalizedEmail];
      return res.status(400).json({ msg: "OTP has expired. Please request a new OTP." });
    }

    if (storedOtp !== normalizedOtp) {
      return res.status(400).json({ msg: "Invalid OTP. Please check and try again." });
    }

    const { name, password } = otpData.userData;
    const user = await User.create({ name, email: normalizedEmail, password });

    delete otpStore[normalizedEmail];

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "5h",
    });

    return res.json({ user, token });
  } catch (err) {
    console.error("Verify OTP error:", err.message);
    return res.status(500).send("Server error");
  }
};

export const resendOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const normalizedEmail = String(email).trim().toLowerCase();
    const otpData = otpStore[normalizedEmail];

    if (!otpData) {
      return res.status(400).json({
        msg: "User data not found. Please start the signup process again.",
      });
    }

    if (!otp) {
      return res.status(400).json({ msg: "OTP is required" });
    }

    const normalizedOtp = String(otp).trim().replace(/\D/g, "");
    otpData.otp = normalizedOtp;
    otpData.expires = Date.now() + 5 * 60 * 1000;

    try {
      await sendEmail(
        normalizedEmail,
        "Resend OTP for Digital Voyager Registration",
        `Hello ${otpData.userData.name},\n\nYour new OTP for Digital Voyager registration is: ${normalizedOtp}\n\nThis OTP is valid for 5 minutes.\n\nIf you didn't request this, please ignore this email.`
      );
      console.log("OTP resent to:", normalizedEmail);
    } catch (emailError) {
      console.error("Failed to resend OTP:", emailError.message);
      return res.status(500).json({
        msg: `Failed to resend OTP email: ${emailError.message}`,
        error: emailError.message,
      });
    }

    return res.status(200).json({ msg: "OTP resent successfully" });
  } catch (err) {
    console.error("Resend OTP error:", err.message);
    return res.status(500).send("Server error");
  }
};

export const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "5h",
    });

    return res.json({ user, token });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).send("Server error");
  }
};

export const forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(200).json({
        msg: "If that email exists, a password reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.passwordResetExpires = Date.now() + 3600000;

    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    const emailMessage = `Hello ${user.name},\n\nYou requested to reset your password for your Digital Voyager account.\n\nClick the link below to reset your password:\n\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you did not request this password reset, please ignore this email and your password will remain unchanged.\n\nBest regards,\nDigital Voyager Team`;

    try {
      await sendEmail(normalizedEmail, "Password Reset Request - Digital Voyager", emailMessage);
      console.log("Password reset email sent to:", normalizedEmail);
      res.status(200).json({
        msg: "If that email exists, a password reset link has been sent.",
      });
    } catch (emailError) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      console.error("Error sending password reset email:", emailError.message);
      return res.status(500).json({
        msg: "Error sending password reset email. Please try again later.",
      });
    }
  } catch (err) {
    console.error("Forgot password error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  const { resetToken } = req.params;
  const { password } = req.body;

  try {
    if (!resetToken) {
      return res.status(400).json({ msg: "Reset token is required" });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters" });
    }

    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        msg: "Invalid or expired reset token. Please request a new password reset link.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    console.log("Password reset successful for:", user.email);
    res.status(200).json({
      msg: "Password reset successful. You can now login with your new password.",
    });
  } catch (err) {
    console.error("Reset password error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

export const getMe = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res.json(user);
  } catch (err) {
    console.error("Get user error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const { name, email } = req.body;

    if (email) {
      const normalizedEmail = String(email).trim().toLowerCase();
      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: req.user.id },
      });

      if (existingUser) {
        return res.status(400).json({ msg: "Email already in use" });
      }
    }

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (email) updateData.email = String(email).trim().toLowerCase();

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    console.log("Profile updated for:", user.email);
    return res.json(user);
  } catch (err) {
    console.error("Update profile error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};
