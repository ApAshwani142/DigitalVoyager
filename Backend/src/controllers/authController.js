import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

const otpStore = {};

/* ========================= SEND OTP ========================= */
export const sendOtp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, otp } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    if (!otp) {
      return res.status(400).json({ msg: "OTP is required" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedOtp = String(otp).trim().replace(/\D/g, "");

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
        `Hello ${name},

Your OTP for Digital Voyager registration is: ${normalizedOtp}

This OTP is valid for 5 minutes.

If you didn't request this, please ignore this email.

Best regards,
Digital Voyager Team`
      );
      
      return res.status(200).json({ 
        msg: "OTP sent successfully! Please check your email inbox.",
        emailSent: true
      });
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError.message);
      return res.status(500).json({
        msg: `Failed to send OTP email: ${emailError.message}`,
        error: emailError.message,
      });
    }
  } catch (err) {
    console.error("Send OTP error:", err.message);
    return res.status(500).send("Server error");
  }
};

/* ========================= VERIFY OTP ========================= */
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ msg: "Email and OTP are required" });
  }

  try {
    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedOtp = String(otp).trim().replace(/\D/g, "");

    if (normalizedOtp.length !== 6) {
      return res.status(400).json({ msg: "Invalid OTP format" });
    }

    const otpData = otpStore[normalizedEmail];
    if (!otpData) {
      return res.status(400).json({ msg: "OTP not found" });
    }

    if (otpData.expires < Date.now()) {
      delete otpStore[normalizedEmail];
      return res.status(400).json({ msg: "OTP expired" });
    }

    if (otpData.otp !== normalizedOtp) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    const { name, password } = otpData.userData;
    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
    });

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

/* ========================= RESEND OTP ========================= */
export const resendOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const normalizedEmail = String(email).trim().toLowerCase();
    const otpData = otpStore[normalizedEmail];

    if (!otpData) {
      return res.status(400).json({ msg: "User data not found" });
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
        `Hello ${otpData.userData.name},

Your new OTP for Digital Voyager registration is: ${normalizedOtp}

This OTP is valid for 5 minutes.

If you didn't request this, please ignore this email.

Best regards,
Digital Voyager Team`
      );
      
      return res.status(200).json({ 
        msg: "OTP resent successfully! Please check your email inbox.",
        emailSent: true
      });
    } catch (emailError) {
      console.error("Failed to resend OTP email:", emailError.message);
      return res.status(500).json({
        msg: `Failed to resend OTP email: ${emailError.message}`,
        error: emailError.message,
      });
    }
  } catch (err) {
    console.error("Resend OTP error:", err.message);
    return res.status(500).send("Server error");
  }
};

/* ========================= LOGIN ========================= */
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

/* ========================= FORGOT PASSWORD ========================= */
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
        msg: "If that email exists, a reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetExpires = Date.now() + 3600000;
    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    await sendEmail(
      normalizedEmail,
      "Password Reset Request - Digital Voyager",
      `Hello ${user.name},

Reset your password using the link below:

${resetUrl}

This link will expire in 1 hour.`
    );

    return res.status(200).json({
      msg: "If that email exists, a reset link has been sent.",
    });
  } catch (err) {
    console.error("Forgot password error:", err.message);
    return res.status(500).json({ msg: "Server error" });
  }
};

/* ========================= RESET PASSWORD ========================= */
export const resetPassword = async (req, res) => {
  const { resetToken } = req.params;
  const { password } = req.body;

  try {
    if (!password || password.length < 6) {
      return res.status(400).json({ msg: "Password too short" });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired token" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    return res.status(200).json({
      msg: "Password reset successful",
    });
  } catch (err) {
    console.error("Reset password error:", err.message);
    return res.status(500).json({ msg: "Server error" });
  }
};

/* ========================= GET USER ========================= */
export const getMe = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res.json(user);
  } catch (err) {
    console.error("Get user error:", err.message);
    return res.status(500).json({ msg: "Server error" });
  }
};

/* ========================= UPDATE PROFILE ========================= */
export const updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    if (!req.user?.id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const { name, email } = req.body;
    const updateData = {};

    if (name) updateData.name = name.trim();
    if (email) {
      const normalizedEmail = email.trim().toLowerCase();
      const exists = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: req.user.id },
      });

      if (exists) {
        return res.status(400).json({ msg: "Email already in use" });
      }

      updateData.email = normalizedEmail;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    return res.json(user);
  } catch (err) {
    console.error("Update profile error:", err.message);
    return res.status(500).json({ msg: "Server error" });
  }
};
