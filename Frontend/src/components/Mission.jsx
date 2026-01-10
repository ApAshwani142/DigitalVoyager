import React from "react";
import { motion } from "framer-motion";
import { Target, Shield, Heart, Lightbulb, Users, TrendingUp, Lock, CheckCircle } from "lucide-react";

const Mission = () => {
  const missionPoints = [
    { icon: <Target className="w-6 h-6" />, title: "Empower Clients", desc: "Highest level of forensic expertise and state-of-the-art technology" },
    { icon: <Shield className="w-6 h-6" />, title: "Single Window Solution", desc: "All digital forensics, cybersecurity, and information security needs" },
    { icon: <TrendingUp className="w-6 h-6" />, title: "Strategic Partnerships", desc: "Leading OEM partnerships for cutting-edge solutions" },
    { icon: <CheckCircle className="w-6 h-6" />, title: "Make in India", desc: "Local talent, resources, and expertise for innovation" },
  ];

  const coreValues = [
    { icon: <Shield className="w-8 h-8" />, title: "Integrity & Ethics", desc: "Highest ethical standards ensuring honesty and fairness" },
    { icon: <Target className="w-8 h-8" />, title: "Excellence", desc: "Superior quality and performance with continuous innovation" },
    { icon: <Lock className="w-8 h-8" />, title: "Confidentiality", desc: "Protecting client data with utmost care and privacy" },
    { icon: <CheckCircle className="w-8 h-8" />, title: "Accuracy", desc: "Precise and meticulous work guaranteeing reliability" },
    { icon: <Heart className="w-8 h-8" />, title: "Empathy", desc: "Understanding client needs with compassion and support" },
    { icon: <TrendingUp className="w-8 h-8" />, title: "Adaptability", desc: "Agile and responsive to new challenges and technologies" },
    { icon: <Lightbulb className="w-8 h-8" />, title: "Innovation", desc: "Embracing new technologies to stay ahead of threats" },
    { icon: <Users className="w-8 h-8" />, title: "Client Focus", desc: "Customized solutions meeting unique client needs" },
  ];

  return (
    <section className="bg-[#0b1220] text-white py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold mb-8 text-center"
          >
            Our Mission
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {missionPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 0px 25px rgba(56,189,248,0.5)",
                  borderColor: "rgba(56,189,248,0.8)",
                }}
                className="bg-[#111827] rounded-xl p-6 border border-gray-700 hover:border-sky-400 transition-all text-center"
              >
                <div className="text-sky-400 mb-4 flex justify-center">
                  {point.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{point.title}</h3>
                <p className="text-gray-400 text-sm">{point.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Core Values Section */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold mb-8 text-center"
          >
            Our Core Values
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, index) => (
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
                  {value.icon}
                </div>
                <h4 className="text-lg font-semibold mb-2">{value.title}</h4>
                <p className="text-gray-400 text-sm">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;
