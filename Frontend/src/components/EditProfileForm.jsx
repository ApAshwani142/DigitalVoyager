import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Save, X } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const EditProfileForm = ({ userData, onCancel, onSave }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
      });
    }
  }, [userData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    try {
      const config = {
        headers: {
          "x-auth-token": token,
        },
      };

      const res = await axios.put(
        "http://localhost:5000/api/auth/update-profile",
        formData,
        config
      );

      toast.success("Profile updated successfully!");
      if (onSave) onSave(res.data);
    } catch (err) {
      console.error("Error updating profile:", err);
      
      // Handle different error types
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        toast.error("Cannot connect to server. Please ensure the backend server is running.");
      } else if (err.response?.status === 404) {
        toast.error("Update endpoint not found. Please restart the backend server.");
      } else if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
      } else {
        const errorMsg = err.response?.data?.msg || err.response?.data?.errors?.[0]?.msg || "Failed to update profile";
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <User className="w-4 h-4 inline mr-2" />
          Full Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`w-full px-4 py-3 rounded-lg bg-[#0d1325] border ${
            errors.name ? "border-red-500" : "border-gray-700"
          } text-white focus:outline-none focus:ring-2 focus:ring-sky-500`}
          placeholder="Enter your full name"
        />
        {errors.name && (
          <p className="text-red-400 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <Mail className="w-4 h-4 inline mr-2" />
          Email Address
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={`w-full px-4 py-3 rounded-lg bg-[#0d1325] border ${
            errors.email ? "border-red-500" : "border-gray-700"
          } text-white focus:outline-none focus:ring-2 focus:ring-sky-500`}
          placeholder="Enter your email address"
        />
        {errors.email && (
          <p className="text-red-400 text-sm mt-1">{errors.email}</p>
        )}
      </div>

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
    </motion.form>
  );
};

export default EditProfileForm;


