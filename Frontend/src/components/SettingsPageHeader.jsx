import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings as SettingsIcon } from 'lucide-react';

const SettingsPageHeader = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <button
        onClick={() => navigate("/profile")}
        className="flex items-center gap-2 text-gray-400 hover:text-sky-400 transition mb-4"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Profile
      </button>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center">
          <SettingsIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Settings</h1>
          <p className="text-gray-400">Manage your account preferences</p>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPageHeader;

