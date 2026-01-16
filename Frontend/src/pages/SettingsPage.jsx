import React from "react";
import { motion } from "framer-motion";
import SettingsPageHeader from "../components/SettingsPageHeader";
import SettingsForm from "../components/SettingsForm";

const SettingsPage = () => {
  const handleSave = (settings) => {
    console.log("Settings saved:", settings);
  };

  return (
    <div className="bg-[#0b1220] text-white min-h-screen py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <SettingsPageHeader />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <SettingsForm onSave={handleSave} />
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;
