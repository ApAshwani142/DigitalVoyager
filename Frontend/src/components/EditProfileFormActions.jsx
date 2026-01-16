import React from 'react';
import { motion } from 'framer-motion';
import { Save, X } from 'lucide-react';

const EditProfileFormActions = ({ loading, onCancel }) => {
  return (
    <div className="flex gap-4 pt-4">
      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-400 rounded-lg font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Save className="w-5 h-5" />
        {loading ? "Saving..." : "Save Changes"}
      </motion.button>
      <motion.button
        type="button"
        onClick={onCancel}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-[#111827] border border-gray-700 rounded-lg font-semibold hover:border-sky-400 transition"
      >
        <X className="w-5 h-5" />
        Cancel
      </motion.button>
    </div>
  );
};

export default EditProfileFormActions;

