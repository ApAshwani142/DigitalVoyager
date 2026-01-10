import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Settings as SettingsIcon } from "lucide-react";
import SettingsForm from "../components/SettingsForm";
import { toast } from "react-toastify";

const SettingsPage = () => {
  const navigate = useNavigate();

  const handleSave = (settings) => {
    console.log("Settings saved:", settings);
  };

  return (
    <div className="bg-[#0b1220] text-white min-h-screen py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
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


