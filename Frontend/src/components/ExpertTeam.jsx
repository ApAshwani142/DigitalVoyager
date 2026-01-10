import React from "react";
import { motion } from "framer-motion";

const teamMembers = [
  {
    name: "Dr. Sarah Chen",
    role: "Chief Forensic Officer",
    desc: "15+ years in digital forensics and cybersecurity investigation",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Marcus Rodriguez",
    role: "Senior Security Analyst",
    desc: "Expert in malware analysis and incident response",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Dr. Emily Watson",
    role: "Digital Evidence Specialist",
    desc: "Ph.D in Computer Forensics, certified in multiple investigation tools",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

const ExpertTeam = () => {
  return (
    <section className="bg-[#0b1220] py-16 px-6 md:px-12 text-white">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-center mb-4"
      >
        Our Expert Team
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-gray-300 text-center max-w-3xl mx-auto mb-12"
      >
        A team of experienced professionals specializing in digital forensics, cybersecurity, and legal consultancy.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15, duration: 0.5 }}
            whileHover={{
              scale: 1.08,
              boxShadow: "0px 0px 25px rgba(56,189,248,0.5)",
              borderColor: "rgba(56,189,248,0.8)",
            }}
            className="bg-[#111827] rounded-xl shadow-lg p-8 text-center border border-gray-700 hover:border-sky-400 transition-all"
          >
            <motion.img
              src={member.img}
              alt={member.name}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-sky-400/30"
            />
            <h3 className="font-bold text-lg mb-1">{member.name}</h3>
            <p className="text-sky-400 mb-2">{member.role}</p>
            <p className="text-gray-400 text-sm">{member.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ExpertTeam;
