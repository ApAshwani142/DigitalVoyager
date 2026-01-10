import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ServicesHero from '../components/ServicesHero'; // Import ServicesHero
import ServicesGrid from '../components/ServicesGrid'; // Import ServicesGrid
import CTA from '../components/CTA'; // Import CTA

const containerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
  exit: { opacity: 0 },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
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
        const res = await axios.get('http://localhost:5000/api/products', config);
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

      {isAuthenticated && products.length > 0 && (
        <motion.div
          className="authenticated-products-section container mx-auto p-4 py-8 md:py-12 mt-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <motion.h1 
            className="text-3xl md:text-4xl font-extrabold mb-8 text-center text-gray-800"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Your Curated Products
          </motion.h1>

          {loading ? (
            <LoadingSpinner message="Loading your digital products..." />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : (
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <motion.div key={product._id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
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
