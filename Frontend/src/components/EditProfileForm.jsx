import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../config/api";
import EditProfileFormFields from "./EditProfileFormFields";
import EditProfileFormActions from "./EditProfileFormActions";

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
        API_ENDPOINTS.UPDATE_PROFILE,
        formData,
        config
      );

      toast.success("Profile updated successfully!");
      if (onSave) onSave(res.data);
    } catch (err) {
      console.error("Error updating profile:", err);
      
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
      <EditProfileFormFields 
        formData={formData}
        errors={errors}
        onChange={setFormData}
      />
      <EditProfileFormActions 
        loading={loading}
        onCancel={onCancel}
      />
    </motion.form>
  );
};

export default EditProfileForm;
