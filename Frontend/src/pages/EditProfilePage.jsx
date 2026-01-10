import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import EditProfileForm from "../components/EditProfileForm";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../config/api";

const EditProfilePage = () => {
  const { token, isAuthenticated, user: contextUser } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) {
        setLoading(false);
        toast.error("Please log in to edit your profile.");
        navigate("/login");
        return;
      }

      if (contextUser) {
        setUserData(contextUser);
        setLoading(false);
      }

      try {
        const config = {
          headers: {
            "x-auth-token": token,
          },
        };
        const res = await axios.get(API_ENDPOINTS.GET_ME, config);
        setUserData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        
        if (contextUser) {
          setUserData(contextUser);
          setError(null);
          toast.warning("Using cached profile data. Some information may be outdated.");
        } else {
          setError("Failed to load user profile. Please check your connection and try again.");
          toast.error("Error loading profile. Please try again.");
        }
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUserProfile();
    } else {
      setLoading(false);
      navigate("/login");
    }
  }, [token, isAuthenticated, navigate, contextUser]);

  const handleSave = (updatedData) => {
    setUserData(updatedData);
    setTimeout(() => {
      navigate("/profile");
    }, 1500);
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  if (loading) return <LoadingSpinner message="Loading profile..." />;
  if (error && !userData) return <ErrorMessage message={error} />;
  if (!userData) {
    return (
      <div className="bg-[#0b1220] text-white min-h-screen py-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <ErrorMessage message="User data not found. Please log in again." />
          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-400 rounded-lg font-semibold"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

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
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Edit Profile</h1>
              <p className="text-gray-400">Update your personal information</p>
            </div>
          </div>
        </motion.div>

        {error && userData && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-yellow-900/30 border border-yellow-600 rounded-lg text-yellow-200"
          >
            <p className="text-sm">{error}</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-[#111827] rounded-xl p-6 md:p-8 border border-gray-700 shadow-lg"
        >
          <EditProfileForm
            userData={userData}
            onCancel={handleCancel}
            onSave={handleSave}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default EditProfilePage;


