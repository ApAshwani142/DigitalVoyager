import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ProductImageGallery from '../components/ProductImageGallery';
import ProductInfo from '../components/ProductInfo';
import LoadingSpinner from '../components/LoadingSpinner'; // Assuming you have this
import ErrorMessage from '../components/ErrorMessage';     // Assuming you have this
import { toast } from 'react-toastify';
import { isHardcodedService, getHardcodedService } from '../utils/hardcodedServices';
import { API_ENDPOINTS } from '../config/api';

const productPageVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  exit: { opacity: 0, y: -50, transition: { duration: 0.4, ease: "easeIn" } },
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!token) {
        setLoading(false);
        toast.error("Please log in to view product details.");
        navigate("/login");
        return;
      }

      if (!id) {
        setLoading(false);
        setError('Invalid product ID.');
        toast.error("Invalid product ID.");
        return;
      }

      if (isHardcodedService(id)) {
        const hardcodedProduct = getHardcodedService(id);
        setProduct(hardcodedProduct);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };
        
        const res = await axios.get(API_ENDPOINTS.PRODUCT_BY_ID(id), config);
        setProduct(res.data);
      } catch (err) {
        console.error('Error fetching product:', err);
        
        if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error') || !err.response) {
          setError('Cannot connect to server. Please ensure the backend server is running on port 5000.');
          toast.error("Cannot connect to server. Please start the backend server.");
        } else if (err.response?.status === 404) {
          const errorMsg = err.response?.data?.msg || 'Product not found';
          setError(`${errorMsg}. It may have been deleted or does not exist.`);
          toast.error("Product not found.");
          // Redirect to products page after 3 seconds
          setTimeout(() => {
            navigate("/products");
          }, 3000);
        } else if (err.response?.status === 401) {
          setError('Session expired. Please log in again.');
          toast.error("Session expired. Please log in again.");
          setTimeout(() => navigate("/login"), 2000);
        } else if (err.response?.status === 400) {
          setError('Invalid product ID format.');
          toast.error("Invalid product ID.");
        } else {
          setError('Failed to load product details. Please try again.');
          toast.error("Error loading product. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && id) {
      fetchProduct();
    } else if (!isAuthenticated) {
      setLoading(false);
      navigate("/login");
    }
  }, [id, token, isAuthenticated, navigate]);

  if (loading) return <LoadingSpinner message="Loading product details..." />;
  
  if (error) {
    return (
      <div className="bg-[#0b1220] text-white min-h-screen py-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <ErrorMessage message={error} />
          <div className="mt-6 flex gap-4 justify-center">
            <motion.button
              onClick={() => navigate("/products")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-400 rounded-lg font-semibold shadow-lg"
            >
              Back to Products
            </motion.button>
            <motion.button
              onClick={() => window.location.reload()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-[#111827] border border-gray-700 rounded-lg font-semibold hover:border-sky-400 transition"
            >
              Retry
            </motion.button>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="bg-[#0b1220] text-white min-h-screen py-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <ErrorMessage message="Product not found." />
          <div className="mt-6 flex justify-center">
            <motion.button
              onClick={() => navigate("/products")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-400 rounded-lg font-semibold shadow-lg"
            >
              Back to Products
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0b1220] text-white min-h-screen">
      <motion.div
        className="product-detail-page container mx-auto p-4 py-8 md:py-12"
        variants={productPageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <motion.h1 
          className="text-3xl md:text-4xl font-extrabold mb-8 text-center text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {product.name}
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <ProductImageGallery images={product.images || []} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <ProductInfo product={product} />
          </motion.div>
        </div>
        
        <motion.div
          className="mt-12 bg-[#111827] p-6 md:p-8 rounded-xl border border-gray-700 shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-white">Product Description</h2>
          <p className="text-gray-300 leading-relaxed">
            {product.description || "No detailed description available for this product."}
          </p>
        </motion.div>
        
      </motion.div>
    </div>
  );
};

export default ProductDetail;
