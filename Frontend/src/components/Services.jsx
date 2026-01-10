import React from "react";
import { motion } from "framer-motion";
import { Search, AlertTriangle, Shield, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: "60d5ec49f85e4d2d4c88e7d1",
      title: "Digital Evidence Recovery",
      desc: "We specialize in recovering digital evidence from various devices, including computers, mobile phones, and storage media.",
      price: "$2,500",
      icon: <Search className="w-8 h-8 text-sky-400 mb-4" />,
    },
    {
      id: "60d5ec49f85e4d2d4c88e7d2",
      title: "Cybersecurity Investigations",
      desc: "Our team conducts thorough investigations to identify and mitigate cybersecurity threats and breaches.",
      price: "$5,000",
      icon: <AlertTriangle className="w-8 h-8 text-sky-400 mb-4" />,
    },
    {
      id: "60d5ec49f85e4d2d4c88e7d3",
      title: "Data Analysis and Reporting",
      desc: "We provide detailed analysis and comprehensive reports that are admissible in court.",
      price: "$3,000",
      icon: <Shield className="w-8 h-8 text-sky-400 mb-4" />,
    },
    {
      id: "60d5ec49f85e4d2d4c88e7d4",
      title: "Expert Testimony",
      desc: "Our forensic experts are available to provide expert testimony and consultations for legal proceedings.",
      price: "$4,000",
      icon: <ArrowRight className="w-8 h-8 text-sky-400 mb-4" />,
    },
  ];

  return (
    <section className="bg-[#0d1325] text-white py-16 px-6">
      <h2 className="text-3xl font-bold text-center mb-2">Our Comprehensive Services</h2>
      <p className="text-gray-400 text-center mb-12">
        At Digital Voyager, we offer a range of specialized services designed to meet your digital forensics and cybersecurity needs. Our expert team leverages cutting-edge technology and methodologies to deliver unparalleled solutions.
      </p>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {services.map((s, i) => (
          <motion.div
            key={i}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 0px 25px rgba(56,189,248,0.5)",
              borderColor: "rgba(56,189,248,0.8)",
            }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="relative bg-[#10192d] rounded-xl shadow-lg p-6 text-left cursor-pointer overflow-hidden border border-gray-700 hover:border-sky-400"
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/products/${s.id}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") navigate(`/products/${s.id}`);
            }}
          >
            <div className="relative z-10">
              {s.icon}
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="text-gray-400 mt-2">{s.desc}</p>
              <p className="text-sky-400 mt-4 font-medium">
                Starting at {s.price}
              </p>
              <div className="mt-4 flex justify-end text-sky-400 text-sm font-semibold">
                <span className="flex items-center gap-2">
                  View details <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <motion.button
          onClick={() => navigate("/products")}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="relative bg-gradient-to-r from-blue-600 to-cyan-400 px-6 py-3 rounded-lg font-medium shadow-md overflow-hidden group"
        >
          {/* Button Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-cyan-400/30 opacity-0 group-hover:opacity-100 blur-lg transition duration-300"></div>
          <span className="relative z-10">View All Services</span>
        </motion.button>
      </div>
    </section>
  );
};

export default Services;
