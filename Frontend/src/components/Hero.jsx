import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const smooth = { duration: 0.4, ease: "easeInOut" };

  const handleExploreServices = () => {
    navigate("/products");
  };

  const handleGetHelp = () => {
    navigate("/contact");
  };

  return (
    <section
      className="relative bg-[#0b1220] text-white py-20 px-6 text-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-photo/online-security-dark-background-3d-illustration_1419-2804.jpg')",
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={smooth}
        whileHover={{
          scale: 1.05,
          color: "#38bdf8",
          transition: smooth,
        }}
        className="text-4xl md:text-6xl font-bold will-change-transform"
      >
        Digital Voyager
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, ...smooth }}
        whileHover={{
          scale: 1.03,
          color: "#7dd3fc",
          transition: smooth,
        }}
        className="text-xl text-blue-300 mt-4 will-change-transform"
      >
        Welcome to Digital Voyager, where precision meets innovation.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, ...smooth }}
        whileHover={{
          scale: 1.03,
          color: "#e5e7eb",
          transition: smooth,
        }}
        className="text-gray-300 max-w-2xl mx-auto mt-3 will-change-transform"
      >
        We are a premier digital forensics company committed to delivering comprehensive and reliable forensic solutions. At Digital Voyager, we bring clarity and integrity to the digital world. Incorporated under the Indian Company Act 1956, we are a privately held corporation, headquartered in Delhi and promoted by seasoned parallel entrepreneurs.
      </motion.p>

      <div className="mt-6 flex justify-center gap-4">
        <motion.button
          onClick={handleExploreServices}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, ...smooth }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 0px 18px rgba(56, 189, 248, 0.6)",
            transition: smooth,
          }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-blue-600 to-cyan-400 px-6 py-3 rounded-lg font-medium text-white will-change-transform"
        >
          Explore Services
        </motion.button>

        <motion.button
          onClick={handleGetHelp}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, ...smooth }}
          whileHover={{
            scale: 1.05,
            backgroundColor: "rgba(6,182,212,0.9)",
            color: "#ffffff",
            boxShadow: "0px 0px 18px rgba(6, 182, 212, 0.5)",
            transition: smooth,
          }}
          whileTap={{ scale: 0.95 }}
          className="border border-cyan-500 text-cyan-400 px-6 py-3 rounded-lg font-medium bg-transparent will-change-transform"
        >
          Get Help
        </motion.button>
      </div>
    </section>
  );
};

export default Hero;
