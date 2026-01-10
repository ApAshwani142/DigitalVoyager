import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import emailjs from "@emailjs/browser";
import { generateOTP } from "../utils/generateOTP.js";
import { validateEmail, checkEmailDomain } from "../utils/validateEmail.js";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../config/api";

const Signup = () => {
  const smooth = { duration: 0.4, ease: "easeInOut" };
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);

  const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
  const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
  const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";

  const isEmailJSConfigured = () => {
    return (
      EMAILJS_SERVICE_ID !== "YOUR_SERVICE_ID" &&
      EMAILJS_TEMPLATE_ID !== "YOUR_TEMPLATE_ID" &&
      EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY" &&
      EMAILJS_SERVICE_ID &&
      EMAILJS_TEMPLATE_ID &&
      EMAILJS_PUBLIC_KEY
    );
  };

  useEffect(() => {
    if (isEmailJSConfigured()) {
      emailjs.init(EMAILJS_PUBLIC_KEY);
    }
  }, []);

  useEffect(() => {
    let timer;
    if (showOtpBox && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setResendEnabled(true);
    }
    return () => clearTimeout(timer);
  }, [showOtpBox, countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (password !== confirmPassword) {
      setLoading(false);
      return setMessage("Passwords do not match");
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setLoading(false);
      setMessage(emailValidation.message);
      toast.error(emailValidation.message);
      return;
    }

    const domainCheck = await checkEmailDomain(email);
    if (!domainCheck.valid) {
      setLoading(false);
      setMessage(domainCheck.message);
      toast.error(domainCheck.message);
      return;
    }

    const newOtp = generateOTP();

    try {
      const normalizedEmail = email.trim().toLowerCase();

      if (isEmailJSConfigured()) {
        const emailParams = {
          to_email: normalizedEmail,
          to_name: name,
          otp: newOtp,
          message: `Your OTP for Digital Voyager registration is: ${newOtp}. It is valid for 5 minutes.`,
        };

        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          emailParams,
          EMAILJS_PUBLIC_KEY
        );
      }

      const res = await fetch(API_ENDPOINTS.SEND_OTP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: normalizedEmail, password, otp: newOtp }),
      });

      const data = await res.json();

      if (res.ok) {
        // Check if email was actually sent
        if (data.emailSent) {
          setMessage("OTP sent! Check your email inbox (and spam folder).");
          toast.success("OTP sent successfully! Check your email inbox.");
        } else {
          // Email service not configured - OTP might be in response or logs
          if (data.otp) {
            setMessage(`Email service not configured. Your OTP is: ${data.otp} (This is for testing only - configure email service for production)`);
            toast.warning(`OTP: ${data.otp} (Email service not configured - check Render logs)`);
          } else {
            setMessage("OTP generated. Please check Render backend logs if email service is not configured.");
            toast.warning("Email service not configured. Check backend logs for OTP.");
          }
        }
        setShowOtpBox(true);
        setCountdown(60);
        setResendEnabled(false);
        setOtp("");
      } else {
        const errorMsg = data.msg || data.error || "Failed to send OTP";
        setMessage(errorMsg);
        toast.error(errorMsg);
        console.error("OTP send error:", data);
      }
    } catch (err) {
      let errorMessage = "Failed to send OTP. ";
      
      if (err.status === 400) {
        errorMessage = "Invalid email address or email service error. Please check your email and try again.";
      } else if (err.text) {
        errorMessage += err.text;
      } else if (err.message) {
        errorMessage += err.message;
      } else {
        errorMessage += "Please check your email address and try again.";
      }
      
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const normalizedOtp = otp.trim().replace(/\D/g, "").slice(0, 6);
    
    if (!normalizedOtp || normalizedOtp.length !== 6) {
      setMessage("Please enter a valid 6-digit OTP");
      toast.error("Please enter a valid 6-digit OTP");
      setOtp("");
      return;
    }

    if (normalizedOtp !== otp) {
      setOtp(normalizedOtp);
    }

    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      
      const res = await fetch(API_ENDPOINTS.VERIFY_OTP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, otp: normalizedOtp }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("OTP verified successfully!");
        toast.success("Account created successfully!");
        login(data.user, data.token);
        setTimeout(() => {
          navigate(location.state?.from || "/");
        }, 1000);
      } else {
        setMessage(data.msg || "Invalid OTP");
        toast.error(data.msg || "Invalid OTP");
        setOtp("");
      }
    } catch (err) {
      setMessage("Server error. Please try again.");
      toast.error("Server error. Please try again.");
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!resendEnabled) return;

    // Validate email before resending
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setMessage(emailValidation.message);
      toast.error(emailValidation.message);
      return;
    }

    setLoading(true);
    const newOtp = generateOTP();

    try {
      const normalizedEmail = email.trim().toLowerCase();

      if (isEmailJSConfigured()) {
        const emailParams = {
          to_email: normalizedEmail,
          to_name: name,
          otp: newOtp,
          message: `Your new OTP for Digital Voyager registration is: ${newOtp}. It is valid for 5 minutes.`,
        };

        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          emailParams,
          EMAILJS_PUBLIC_KEY
        );
      }

      const res = await fetch(API_ENDPOINTS.RESEND_OTP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, otp: newOtp }),
      });

      const data = await res.json();

      if (res.ok) {
        // Check if email was actually sent
        if (data.emailSent) {
          setMessage("OTP resent! Check your email inbox (and spam folder).");
          toast.success("OTP resent successfully! Check your email inbox.");
        } else {
          // Email service not configured
          if (data.otp) {
            setMessage(`Email service not configured. Your new OTP is: ${data.otp} (This is for testing only)`);
            toast.warning(`New OTP: ${data.otp} (Email service not configured)`);
          } else {
            setMessage("OTP regenerated. Please check Render backend logs if email service is not configured.");
            toast.warning("Email service not configured. Check backend logs for OTP.");
          }
        }
        setCountdown(60);
        setResendEnabled(false);
        setOtp("");
      } else {
        const errorMsg = data.msg || data.error || "Failed to resend OTP";
        setMessage(errorMsg);
        toast.error(errorMsg);
        console.error("OTP resend error:", data);
      }
    } catch (err) {
      let errorMessage = "Failed to resend OTP. ";
      
      if (err.status === 400) {
        errorMessage = "Invalid email address or email service error. Please check your email and try again.";
      } else if (err.text) {
        errorMessage += err.text;
      } else if (err.message) {
        errorMessage += err.message;
      } else {
        errorMessage += "Please check your email address and try again.";
      }
      
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1220] text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={smooth}
        className="bg-[#111827] p-8 rounded-2xl shadow-lg border border-gray-800 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-6">Sign Up</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-[#0d1325] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-[#0d1325] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-[#0d1325] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-[#0d1325] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={smooth}
            disabled={loading}
            className={`w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold text-white ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </motion.button>
        </form>

        {message && (
          <p
            className={`text-center text-sm mt-3 ${
              message.includes("✅") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}

        {showOtpBox && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={smooth}
            className="mt-6 space-y-3"
          >
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                setOtp(value);
              }}
              maxLength={6}
              className="w-full px-4 py-2 rounded-lg bg-[#0d1325] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-center text-2xl tracking-widest"
            />

            <p className="text-center text-sm text-gray-400">
              {countdown > 0
                ? `Resend OTP in ${countdown}s`
                : "You can now resend OTP"}
            </p>

            <button
              onClick={handleResendOtp}
              disabled={!resendEnabled}
              className={`w-full py-2 rounded-lg font-semibold transition ${
                resendEnabled
                  ? "text-cyan-400 hover:underline"
                  : "text-gray-500 cursor-not-allowed"
              }`}
            >
              Resend OTP
            </button>

            <motion.button
              onClick={handleVerifyOtp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={smooth}
              disabled={loading || !otp || otp.length !== 6}
              className={`w-full py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg font-semibold text-white ${
                loading || !otp || otp.length !== 6
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {loading ? "Verifying..." : "Verify & Sign Up"}
            </motion.button>
          </motion.div>
        )}

        <div className="mt-6 space-y-3">
          <button className="w-full py-2 flex items-center justify-center gap-2 bg-red-500 rounded-lg font-semibold hover:bg-red-600 transition">
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Sign up with Google
          </button>
          <button className="w-full py-2 flex items-center justify-center gap-2 bg-blue-700 rounded-lg font-semibold hover:bg-blue-800 transition">
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg"
              alt="Facebook"
              className="w-5 h-5"
            />
            Sign up with Facebook
          </button>
        </div>

        <p className="mt-4 text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-cyan-400 hover:underline">
            Login
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
