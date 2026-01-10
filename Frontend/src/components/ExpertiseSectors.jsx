import React from "react";
import { motion } from "framer-motion";
import { Handshake, Factory, Cpu, Code, Database, Network } from "lucide-react";

const ExpertiseSectors = () => {
  const partnerships = [
    { icon: <Handshake className="w-8 h-8" />, title: "OEM Partnerships", desc: "Authorized reseller and partner of leading OEMs with access to latest forensic tools" },
    { icon: <Cpu className="w-8 h-8" />, title: "Forensic Workstations", desc: "High-performance workstations designed and manufactured in India" },
    { icon: <Code className="w-8 h-8" />, title: "Software Solutions", desc: "Advanced software tools for digital evidence analysis" },
    { icon: <Database className="w-8 h-8" />, title: "Specialized Solutions", desc: "Custom solutions for various forensic needs" },
    { icon: <Network className="w-8 h-8" />, title: "Cutting-Edge Technology", desc: "World-class solutions with highest quality standards" },
    { icon: <Factory className="w-8 h-8" />, title: "Make in India", desc: "Leveraging local talent and expertise for innovation" },
  ];

  return (
    <section className="py-16 px-6 md:px-12 text-white bg-[#0d1325]">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-center mb-4"
      >
        Our Partnerships & Innovation
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-gray-300 text-center max-w-3xl mx-auto mb-12"
      >
        We believe in the power of collaboration and continuous innovation to deliver unparalleled digital forensics and cybersecurity solutions.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {partnerships.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{
              scale: 1.08,
              boxShadow: "0px 0px 25px rgba(56,189,248,0.5)",
              borderColor: "rgba(56,189,248,0.8)",
            }}
            className="bg-[#111827] rounded-xl p-6 border border-gray-700 hover:border-sky-400 transition-all"
          >
            <div className="text-sky-400 mb-4">
              {item.icon}
            </div>
            <h3 className="font-semibold text-lg mb-3">{item.title}</h3>
            <p className="text-gray-400 text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ExpertiseSectors;
