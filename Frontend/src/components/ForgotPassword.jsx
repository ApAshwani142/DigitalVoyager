import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { validateEmail } from "../utils/validateEmail.js";

const ForgotPassword = () => {
  const smooth = { duration: 0.4, ease: "easeInOut" };
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setLoading(false);
      setMessage(emailValidation.message);
      toast.error(emailValidation.message);
      return;
    }

    try {
      const normalizedEmail = email.trim().toLowerCase();
      
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        setEmailSent(true);
        setMessage("Password reset link sent! Check your email inbox (and spam folder).");
        toast.success("Password reset link sent! Check your email.");
      } else {
        if (data.errors && Array.isArray(data.errors)) {
          const errorMsg = data.errors.map(e => e.msg).join(", ");
          setMessage(errorMsg);
          toast.error(errorMsg);
        } else {
          setMessage(data.msg || "Failed to send reset link");
          toast.error(data.msg || "Failed to send reset link");
        }
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      if (err.message && err.message.includes("Failed to fetch")) {
        setMessage("Cannot connect to server. Please make sure the backend server is running.");
        toast.error("Cannot connect to server. Please check if backend is running.");
      } else {
        setMessage("Server error. Please try again.");
        toast.error("Server error. Please try again.");
      }
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
        <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>
        
        {!emailSent ? (
          <>
            <p className="text-gray-400 text-sm text-center mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg bg-[#0d1325] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
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
                {loading ? "Sending..." : "Send Reset Link"}
              </motion.button>
            </form>

            {message && (
              <p className="text-center text-sm mt-3 text-red-400">
                {message}
              </p>
            )}
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="bg-green-900/20 border border-green-600/50 rounded-lg p-4">
              <p className="text-green-400 text-sm mb-2">
                Password reset link has been sent!
              </p>
              <p className="text-gray-400 text-xs">
                Check your email inbox at <strong>{email}</strong> for the reset link.
                <br />
                Don't forget to check your spam folder.
              </p>
            </div>
            <p className="text-gray-400 text-sm">
              The reset link will expire in 1 hour.
            </p>
            <button
              onClick={() => {
                setEmailSent(false);
                setEmail("");
                setMessage("");
              }}
              className="text-cyan-400 hover:underline text-sm"
            >
              Send to a different email
            </button>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-gray-400">
          Remember your password?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-cyan-400 hover:underline"
          >
            Back to Login
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
