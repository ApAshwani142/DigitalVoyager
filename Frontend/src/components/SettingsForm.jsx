import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Lock, Shield, Moon, Globe, Save } from "lucide-react";
import { toast } from "react-toastify";

const SettingsForm = ({ onSave }) => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      sms: false,
    },
    privacy: {
      profileVisibility: "public",
      showEmail: false,
    },
    security: {
      twoFactor: false,
      loginAlerts: true,
    },
    preferences: {
      theme: "dark",
      language: "en",
    },
  });
  const [loading, setLoading] = useState(false);

  const handleToggle = (category, key) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [key]: !settings[category][key],
      },
    });
  };

  const handleSelect = (category, key, value) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Settings saved successfully!");
      setLoading(false);
      if (onSave) onSave(settings);
    }, 1000);
  };

  const SettingCard = ({ icon, title, children }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        boxShadow: "0px 0px 25px rgba(56,189,248,0.3)",
        borderColor: "rgba(56,189,248,0.8)",
      }}
      className="bg-[#111827] rounded-xl p-6 border border-gray-700 hover:border-sky-400 transition-all"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="text-sky-400">{icon}</div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {children}
    </motion.div>
  );

  const ToggleSwitch = ({ enabled, onChange, label }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-700 last:border-0">
      <span className="text-gray-300">{label}</span>
      <button
        type="button"
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? "bg-sky-500" : "bg-gray-600"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <SettingCard icon={<Bell className="w-6 h-6" />} title="Notifications">
        <div className="space-y-0">
          <ToggleSwitch
            enabled={settings.notifications.email}
            onChange={() => handleToggle("notifications", "email")}
            label="Email Notifications"
          />
          <ToggleSwitch
            enabled={settings.notifications.push}
            onChange={() => handleToggle("notifications", "push")}
            label="Push Notifications"
          />
          <ToggleSwitch
            enabled={settings.notifications.sms}
            onChange={() => handleToggle("notifications", "sms")}
            label="SMS Notifications"
          />
        </div>
      </SettingCard>

      <SettingCard icon={<Shield className="w-6 h-6" />} title="Privacy">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Profile Visibility
            </label>
            <select
              value={settings.privacy.profileVisibility}
              onChange={(e) =>
                handleSelect("privacy", "profileVisibility", e.target.value)
              }
              className="w-full px-4 py-2 rounded-lg bg-[#0d1325] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="friends">Friends Only</option>
            </select>
          </div>
          <ToggleSwitch
            enabled={settings.privacy.showEmail}
            onChange={() => handleToggle("privacy", "showEmail")}
            label="Show Email Address"
          />
        </div>
      </SettingCard>

      <SettingCard icon={<Lock className="w-6 h-6" />} title="Security">
        <div className="space-y-0">
          <ToggleSwitch
            enabled={settings.security.twoFactor}
            onChange={() => handleToggle("security", "twoFactor")}
            label="Two-Factor Authentication"
          />
          <ToggleSwitch
            enabled={settings.security.loginAlerts}
            onChange={() => handleToggle("security", "loginAlerts")}
            label="Login Alerts"
          />
        </div>
      </SettingCard>

      <SettingCard icon={<Moon className="w-6 h-6" />} title="Preferences">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Theme
            </label>
            <select
              value={settings.preferences.theme}
              onChange={(e) =>
                handleSelect("preferences", "theme", e.target.value)
              }
              className="w-full px-4 py-2 rounded-lg bg-[#0d1325] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Globe className="w-4 h-4 inline mr-2" />
              Language
            </label>
            <select
              value={settings.preferences.language}
              onChange={(e) =>
                handleSelect("preferences", "language", e.target.value)
              }
              className="w-full px-4 py-2 rounded-lg bg-[#0d1325] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="es">Spanish</option>
            </select>
          </div>
        </div>
      </SettingCard>

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-400 rounded-lg font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Save className="w-5 h-5" />
        {loading ? "Saving..." : "Save Settings"}
      </motion.button>
    </motion.form>
  );
};

export default SettingsForm;


