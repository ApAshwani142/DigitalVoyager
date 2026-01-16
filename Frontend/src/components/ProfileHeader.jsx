import React from 'react';
import { motion } from 'framer-motion';

const ProfileHeader = ({ userName }) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="inline-block mb-6"
      >
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center text-4xl font-bold text-white shadow-lg border-4 border-[#111827]">
          {getInitials(userName)}
        </div>
      </motion.div>
      <h1 className="text-4xl md:text-5xl font-bold mb-2">{userName}</h1>
      <p className="text-gray-400 text-lg">Digital Voyager Member</p>
    </motion.div>
  );
};

export default ProfileHeader;

