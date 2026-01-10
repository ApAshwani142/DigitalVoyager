import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Login = () => {
  const smooth = { duration: 0.4, ease: "easeInOut" };
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.user, data.token, "login");
        toast.success("User has successfully logged in!");
        navigate(from, { replace: true });
      } else {
        setMessage(data.msg || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
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
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
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

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={smooth}
            className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold text-white"
          >
            Login
          </motion.button>
        </form>

        {message && (
          <p className="text-center text-sm mt-3 text-red-400">{message}</p>
        )}

        <div className="mt-6 space-y-3">
          <button className="w-full py-2 flex items-center justify-center gap-2 bg-red-500 rounded-lg font-semibold hover:bg-red-600 transition">
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Sign in with Google
          </button>
          <button className="w-full py-2 flex items-center justify-center gap-2 bg-blue-700 rounded-lg font-semibold hover:bg-blue-800 transition">
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg"
              alt="Facebook"
              className="w-5 h-5"
            />
            Sign in with Facebook
          </button>
        </div>

        <div className="mt-4 text-center text-sm text-gray-400">
          <button
            onClick={() => navigate("/forgot-password")}
            className="text-cyan-400 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <p className="mt-4 text-center text-gray-400 text-sm">
          Don’t have an account?{" "}
          <a href="/register" className="text-cyan-400 hover:underline">
            Sign Up
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
