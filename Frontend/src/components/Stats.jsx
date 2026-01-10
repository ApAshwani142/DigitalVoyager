import React from "react";
import { FiPhone } from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Stats = () => {
  const navigate = useNavigate();

  const handleEmergencyHotline = () => {
    navigate("/contact#emergency");
    setTimeout(() => {
      const element = document.getElementById("emergency");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  return (
    <section className="bg-[#0b1220] text-white py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Why Choose Digital Voyager?
        </h2>
        <p className="text-gray-400 mb-12">
          Our unwavering commitment to quality, collaboration, and integrity sets us apart.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div>
            <h3 className="text-4xl font-bold text-blue-400">500+</h3>
            <p className="text-gray-300 mt-2">Cases Solved</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-blue-400">98%</h3>
            <p className="text-gray-300 mt-2">Success Rate</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-blue-400">24/7</h3>
            <p className="text-gray-300 mt-2">Emergency Support</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-blue-400">15+</h3>
            <p className="text-gray-300 mt-2">Years Experience</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center text-left">
          <div>
            <h3 className="text-2xl font-semibold mb-6">
              Why Choose Digital Voyager?
            </h3>
            <ul className="space-y-4 text-gray-300">
              <li>✅ Expertise: Our team combines technical expertise with legal acumen to deliver unparalleled forensic services.</li>
              <li>✅ Reliability: We adhere to strict protocols to ensure the integrity and authenticity of the evidence.</li>
              <li>✅ Cutting-Edge Technology: Our partnership with OEMs and our forensic workstations gives us access to the latest forensic tools and technology.</li>
              <li>✅ Client-Centric Approach: We work closely with our clients to understand their specific needs and deliver customized solutions.</li>
              <li>✅ Support for Make in India: By producing our forensic workstations locally, we contribute to the national initiative to boost manufacturing and innovation in India.</li>
            </ul>
          </div>

          <motion.div
            whileHover={{
              scale: 1.03,
              boxShadow: "0 0 30px rgba(14,165,233,0.55)",
            }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-gradient-to-r from-blue-600 to-cyan-400 rounded-2xl shadow-lg p-8 md:p-10 text-center"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              Need Immediate Assistance?
            </h3>
            <p className="text-white/90 mb-6">
              Our cyber experts are available 24/7 to provide emergency response and protect your digital assets.
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-4">
              <motion.button
                onClick={handleEmergencyHotline}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-900 transition"
              >
                <FiPhone className="text-blue-400" /> Emergency Hotline: 9871493454
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
              >
                Schedule Consultation
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
