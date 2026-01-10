import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const smooth = { duration: 0.4, ease: "easeInOut" };
  const navigate = useNavigate();
  const { resetToken } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);

  useEffect(() => {
    if (!resetToken) {
      setTokenValid(false);
      setMessage("Invalid reset link. No token provided.");
      return;
    }
    setTokenValid(true);
  }, [resetToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters");
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/auth/reset-password/${resetToken}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage("Password reset successfully!");
        toast.success("Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setMessage(data.msg || "Failed to reset password");
        toast.error(data.msg || "Failed to reset password");
        if (data.msg && (data.msg.includes("Invalid") || data.msg.includes("expired"))) {
          setTokenValid(false);
        }
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setMessage("Server error. Please try again.");
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (tokenValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b1220] text-white px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={smooth}
          className="bg-[#111827] p-8 rounded-2xl shadow-lg border border-gray-800 w-full max-w-md text-center"
        >
          <h2 className="text-2xl font-bold mb-4 text-red-400">Invalid Reset Link</h2>
          <p className="text-gray-400 mb-6">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <button
            onClick={() => navigate("/forgot-password")}
            className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold text-white"
          >
            Request New Reset Link
          </button>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 text-cyan-400 hover:underline text-sm"
          >
            Back to Login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1220] text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={smooth}
        className="bg-[#111827] p-8 rounded-2xl shadow-lg border border-gray-800 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Reset Password</h2>
        <p className="text-gray-400 text-sm text-center mb-6">
          Enter your new password below.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={loading}
            className="w-full px-4 py-2 rounded-lg bg-[#0d1325] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            disabled={loading}
            className="w-full px-4 py-2 rounded-lg bg-[#0d1325] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
          />

          {message && (
            <p className="text-center text-sm text-red-400">
              {message}
            </p>
          )}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={smooth}
            disabled={loading || !password || !confirmPassword}
            className={`w-full py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg font-semibold text-white ${
              loading || !password || !confirmPassword
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </motion.button>
        </form>

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

export default ResetPassword;

