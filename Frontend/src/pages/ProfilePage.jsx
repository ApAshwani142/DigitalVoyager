import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ProfileHeader from '../components/ProfileHeader';
import ProfileActions from '../components/ProfileActions';
import ProfileStats from '../components/ProfileStats';
import ProfileInfoCards from '../components/ProfileInfoCards';
import ProfileActivity from '../components/ProfileActivity';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

const ProfilePage = () => {
  const { token, isAuthenticated, logout } = useAuth();
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

  return (
    <div className="bg-[#0b1220] text-white min-h-screen py-12 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <ProfileHeader userName={userData.name} />
        <ProfileActions onLogout={handleLogout} />
        <ProfileStats />
        <ProfileInfoCards userData={userData} />
        <ProfileActivity userData={userData} />
      </div>
    </div>
  );
};

export default ProfilePage;
