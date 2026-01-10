import express from "express";
import { check } from "express-validator";
import {
  sendOtp,
  verifyOtp,
  resendOtp,
  loginUser,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
} from "../controllers/authController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/send-otp",
  [
    check("email", "Valid email is required").isEmail(),
    check("name", "Name is required").notEmpty(),
    check("password", "Password must be 6 or more characters").isLength({ min: 6 }),
    check("otp", "OTP is required").notEmpty(),
  ],
  sendOtp
);

router.post(
  "/verify-otp",
  [
    check("email", "Valid email is required").isEmail(),
    check("otp", "OTP is required").notEmpty(),
  ],
  verifyOtp
);

router.post(
  "/resend-otp",
  [
    check("email", "Valid email is required").isEmail(),
    check("otp", "OTP is required").notEmpty(),
  ],
  resendOtp
);

router.post(
  "/login",
  [
    check("email", "Valid email is required").isEmail(),
    check("password", "Password is required").exists(),
  ],
  loginUser
);

router.post(
  "/forgot-password",
  [check("email", "Valid email is required").isEmail()],
  forgotPassword
);

router.put(
  "/reset-password/:resetToken",
  [check("password", "Password must be 6 or more characters").isLength({ min: 6 })],
  resetPassword
);

router.get("/me", auth, getMe);

router.put(
  "/update-profile",
  auth,
  [
    check("name", "Name is required").optional().notEmpty(),
    check("email", "Valid email is required").optional().isEmail(),
  ],
  updateProfile
);

export default router;
