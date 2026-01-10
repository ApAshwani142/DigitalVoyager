import React from "react";
import { motion } from "framer-motion";
import { Shield, Building2, Users, Award, Target, Zap } from "lucide-react";

const AboutHero = () => {
  const smooth = { duration: 0.4, ease: "easeInOut" };

  const highlights = [
    { icon: <Shield className="w-6 h-6" />, text: "Premier Digital Forensics" },
    { icon: <Building2 className="w-6 h-6" />, text: "Headquartered in Delhi" },
    { icon: <Users className="w-6 h-6" />, text: "Expert Team" },
    { icon: <Award className="w-6 h-6" />, text: "OEM Partner" },
    { icon: <Target className="w-6 h-6" />, text: "Make in India" },
    { icon: <Zap className="w-6 h-6" />, text: "Cutting-Edge Technology" },
  ];

  return (
    <section className="py-20 text-center bg-[#0d1325] text-white relative overflow-hidden px-4 sm:px-6 lg:px-12">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-cyan-400/5 blur-3xl pointer-events-none"></div>

      <motion.h1
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={smooth}
        className="text-4xl md:text-5xl font-bold mb-6 relative z-10"
      >
        About Digital Voyager
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, ...smooth }}
        className="text-gray-300 max-w-3xl mx-auto text-lg mb-12 relative z-10"
      >
        Where precision meets innovation. We are a premier digital forensics company committed to delivering comprehensive and reliable forensic solutions.
      </motion.p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto relative z-10">
        {highlights.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1, ...smooth }}
            whileHover={{
              scale: 1.1,
              boxShadow: "0px 0px 20px rgba(56,189,248,0.5)",
            }}
            className="bg-[#111827] rounded-xl p-4 border border-gray-700 hover:border-sky-400 transition-all"
          >
            <div className="text-sky-400 mb-2 flex justify-center">
              {item.icon}
            </div>
            <p className="text-sm text-gray-300">{item.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default AboutHero;
