import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Shield, Edit, LogOut, Settings, Award, Clock } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

const ProfilePage = () => {
  const { token, isAuthenticated, logout, user: contextUser } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) {
        setLoading(false);
        toast.error("Please log in to view your profile.");
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };
        const res = await axios.get(API_ENDPOINTS.GET_ME, config);
        setUserData(res.data);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load user profile.');
        toast.error("Error loading profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token, isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) return <LoadingSpinner message="Loading profile..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!userData) return <ErrorMessage message="User data not found." />;

  const memberSince = new Date(userData.date);
  const now = new Date();
  const daysSince = Math.floor((now - memberSince) / (1000 * 60 * 60 * 24));
  const monthsSince = Math.floor(daysSince / 30);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const profileCards = [
    {
      icon: <User className="w-6 h-6" />,
      title: "Full Name",
      value: userData.name,
      color: "text-sky-400",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Address",
      value: userData.email,
      color: "text-cyan-400",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Member Since",
      value: memberSince.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      color: "text-blue-400",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Member Duration",
      value: monthsSince > 0 ? `${monthsSince} months` : `${daysSince} days`,
      color: "text-indigo-400",
    },
  ];

  const statsCards = [
    {
      icon: <Award className="w-8 h-8" />,
      title: "Account Status",
      value: "Active",
      subtitle: "Verified Account",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Security",
      value: "Protected",
      subtitle: "Secure Login",
      color: "from-blue-500 to-cyan-500",
    },
  ];

  return (
    <div className="bg-[#0b1220] text-white min-h-screen py-12 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block mb-6"
          >
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center text-4xl font-bold text-white shadow-lg border-4 border-[#111827]">
              {getInitials(userData.name)}
            </div>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{userData.name}</h1>
          <p className="text-gray-400 text-lg">Digital Voyager Member</p>
        </motion.div>

        {/* Action Buttons */}
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
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 0px 25px rgba(56,189,248,0.5)",
              }}
              className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 shadow-lg`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-white/90">{stat.icon}</div>
                <div className="text-right">
                  <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                  <p className="text-white/80 text-sm">{stat.title}</p>
                </div>
              </div>
              <p className="text-white/70 text-sm">{stat.subtitle}</p>
            </motion.div>
          ))}
        </div>

        {/* Profile Information Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <User className="w-6 h-6 text-sky-400" />
            Profile Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profileCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0px 0px 25px rgba(56,189,248,0.3)",
                  borderColor: "rgba(56,189,248,0.8)",
                }}
                className="bg-[#111827] rounded-xl p-6 border border-gray-700 hover:border-sky-400 transition-all"
              >
                <div className={`${card.color} mb-3`}>{card.icon}</div>
                <h3 className="text-gray-400 text-sm mb-1">{card.title}</h3>
                <p className="text-white text-lg font-semibold">{card.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Account Activity Section */}
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
      </div>
    </div>
  );
};

export default ProfilePage;
