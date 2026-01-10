import React from "react";
import { motion } from "framer-motion";

const ContactHero = () => {
  const smooth = { duration: 0.4, ease: "easeInOut" };

  return (
    <section className="text-center py-16 bg-[#0f172a] text-white relative overflow-hidden px-4 sm:px-6 lg:px-12">
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
        className="text-3xl sm:text-4xl md:text-5xl font-bold relative z-10 block will-change-transform"
        style={{ transformOrigin: "center" }}
      >
        Contact Us
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
        className="mt-4 text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto relative z-10 block will-change-transform"
        style={{ transformOrigin: "center" }}
      >
        Get in touch with our forensic experts. We're here to help with your
        digital investigation needs.
      </motion.p>
    </section>
  );
};

export default ContactHero;
