import React from 'react';
import { motion } from 'framer-motion';
import { Award, Shield } from 'lucide-react';

const ProfileStats = () => {
  const statsCards = [
    {
      icon: <Award className="w-8 h-8" />,
      title: "Account Status",
      value: "Active",
      subtitle: "Verified Account",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Security",
      value: "Protected",
      subtitle: "Secure Login",
      color: "from-blue-500 to-cyan-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {statsCards.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 0px 25px rgba(56,189,248,0.5)",
          }}
          className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-white/90">{stat.icon}</div>
            <div className="text-right">
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
              <p className="text-white/80 text-sm">{stat.title}</p>
            </div>
          </div>
          <p className="text-white/70 text-sm">{stat.subtitle}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default ProfileStats;

