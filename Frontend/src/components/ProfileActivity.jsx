import React from 'react';
import { motion } from 'framer-motion';
import { Award, Shield, Mail } from 'lucide-react';

const ProfileActivity = ({ userData }) => {
  const memberSince = new Date(userData.date);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="mt-12"
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Award className="w-6 h-6 text-sky-400" />
        Account Activity
      </h2>
      <div className="bg-[#111827] rounded-xl p-6 border border-gray-700">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#0d1325] rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <p className="text-white font-semibold">Account Created</p>
                <p className="text-gray-400 text-sm">{memberSince.toLocaleDateString()}</p>
              </div>
            </div>
            <span className="text-green-400 text-sm font-semibold">✓ Active</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-[#0d1325] rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-white font-semibold">Email Verified</p>
                <p className="text-gray-400 text-sm">Email address confirmed</p>
              </div>
            </div>
            <span className="text-green-400 text-sm font-semibold">✓ Verified</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileActivity;

