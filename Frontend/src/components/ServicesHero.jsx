import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ServicesHero = () => {
  const smooth = { duration: 0.4, ease: "easeInOut" };
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("authToken"));
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("authToken"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <section className="text-center py-16 bg-gradient-to-b from-[#0b1220] to-[#111827] relative overflow-hidden px-4 sm:px-6 lg:px-12">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-cyan-400/5 blur-3xl pointer-events-none"></div>

      <motion.h1
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={smooth}
        whileHover={{
          scale: 1.05,
          color: "#7dd3fc",
          transition: smooth,
        }}
        className="text-4xl font-bold mb-4 relative z-10 will-change-transform block"
        style={{ transformOrigin: "center" }}
      >
        Our Services
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, ...smooth }}
        whileHover={{
          scale: 1.03,
          color: "#bae6fd",
          transition: smooth,
        }}
        className="text-gray-400 text-lg mb-6 relative z-10 will-change-transform block"
        style={{ transformOrigin: "center" }}
      >
        Comprehensive digital forensics and cybersecurity solutions tailored to your needs.
      </motion.p>

      {!isLoggedIn && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, ...smooth }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 0 18px rgba(56,189,248,0.4)",
              transition: smooth,
            }}
            className="bg-[#0f172a] text-cyan-400 p-4 rounded-md text-sm relative z-10 will-change-transform block mx-auto"
            style={{ transformOrigin: "center" }}
          >
            Please login or sign up to access detailed service information and pricing.
          </motion.div>

          <motion.button
            onClick={() => navigate("/login")}
            whileHover={{
              scale: 1.08,
              boxShadow: "0 0 20px rgba(34,211,238,0.6)",
              backgroundColor: "rgba(14,165,233,0.9)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mt-6 w-full max-w-xs mx-auto bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 rounded-lg hover:opacity-90"
          >
            Login to Access
          </motion.button>
        </>
      )}
    </section>
  );
};

export default ServicesHero;
