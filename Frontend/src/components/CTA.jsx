import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CTA = () => {
  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate("/contact");
  };

  return (
    <section className="bg-[#0f172a] py-16 text-center">
      <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
      <p className="text-gray-400 mb-8">
        Contact us today for a consultation and let our experts help protect your digital assets.
      </p>
      <div className="flex justify-center gap-4">
        <motion.button
          onClick={handleContactClick}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 rounded-lg font-medium text-white will-change-transform transform-gpu"
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 0px 18px rgba(56, 189, 248, 0.6)",
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          Contact Us Today
        </motion.button>

        <motion.button
          className="border border-cyan-500 text-cyan-400 px-6 py-3 rounded-lg font-medium bg-transparent will-change-transform transform-gpu"
          whileHover={{
            scale: 1.05,
            backgroundColor: "rgba(6,182,212,0.9)", // cyan-500
            color: "#ffffff",
            boxShadow: "0px 0px 18px rgba(6, 182, 212, 0.5)",
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          Schedule Consultation
        </motion.button>
      </div>
    </section>
  );
};

export default CTA;
