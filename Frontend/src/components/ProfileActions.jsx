import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Edit, Settings, LogOut } from 'lucide-react';

const ProfileActions = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="flex flex-wrap justify-center gap-4 mb-12"
    >
      <motion.button
        onClick={() => navigate("/profile/edit")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-400 rounded-lg font-semibold shadow-lg"
      >
        <Edit className="w-5 h-5" />
        Edit Profile
      </motion.button>
      <motion.button
        onClick={() => navigate("/profile/settings")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-6 py-3 bg-[#111827] border border-gray-700 rounded-lg font-semibold hover:border-sky-400 transition"
      >
        <Settings className="w-5 h-5" />
        Settings
      </motion.button>
      <motion.button
        onClick={onLogout}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-6 py-3 bg-red-600 rounded-lg font-semibold hover:bg-red-700 transition"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </motion.button>
    </motion.div>
  );
};

export default ProfileActions;

