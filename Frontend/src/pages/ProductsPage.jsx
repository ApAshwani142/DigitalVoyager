import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import AuthenticatedProductsSection from '../components/AuthenticatedProductsSection';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ServicesHero from '../components/ServicesHero';
import ServicesGrid from '../components/ServicesGrid';
import CTA from '../components/CTA';
import { API_ENDPOINTS } from '../config/api';

const containerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
  exit: { opacity: 0 },
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      if (!isAuthenticated || !token) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };
        const res = await axios.get(API_ENDPOINTS.PRODUCTS, config);
        setProducts(res.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load digital products. Please ensure you are logged in.');
        toast.error("Error loading digital products. Please try again.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [token, isAuthenticated, navigate]);

  return (
    <motion.div
      className="full-products-page"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <ServicesHero />
      <ServicesGrid />

      {isAuthenticated && (
        <AuthenticatedProductsSection 
          products={products} 
          loading={loading} 
          error={error} 
        />
      )}
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: isAuthenticated ? 1.0 : 0.5, duration: 0.6 }}
        className="mt-12"
      >
        <CTA />
      </motion.div>
    </motion.div>
  );
};

export default ProductsPage;
