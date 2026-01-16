import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Clock } from 'lucide-react';

const ProfileInfoCards = ({ userData }) => {
  const memberSince = new Date(userData.date);
  const now = new Date();
  const daysSince = Math.floor((now - memberSince) / (1000 * 60 * 60 * 24));
  const monthsSince = Math.floor(daysSince / 30);

  const profileCards = [
    {
      icon: <User className="w-6 h-6" />,
      title: "Full Name",
      value: userData.name,
      color: "text-sky-400",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Address",
      value: userData.email,
      color: "text-cyan-400",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Member Since",
      value: memberSince.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      color: "text-blue-400",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Member Duration",
      value: monthsSince > 0 ? `${monthsSince} months` : `${daysSince} days`,
      color: "text-indigo-400",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <User className="w-6 h-6 text-sky-400" />
        Profile Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profileCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
            whileHover={{
              scale: 1.03,
              boxShadow: "0px 0px 25px rgba(56,189,248,0.3)",
              borderColor: "rgba(56,189,248,0.8)",
            }}
            className="bg-[#111827] rounded-xl p-6 border border-gray-700 hover:border-sky-400 transition-all"
          >
            <div className={`${card.color} mb-3`}>{card.icon}</div>
            <h3 className="text-gray-400 text-sm mb-1">{card.title}</h3>
            <p className="text-white text-lg font-semibold">{card.value}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProfileInfoCards;

