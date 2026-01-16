import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from './ErrorMessage';

const ProductDetailError = ({ error }) => {
  const navigate = useNavigate();

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
};

export default ProductDetailError;

