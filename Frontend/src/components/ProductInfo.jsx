import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const ProductInfo = ({ product }) => {
  const { isAuthenticated } = useAuth();

  const handleBuyClick = () => {
    if (isAuthenticated) {
      toast.success(`Purchased ${product.name}! (Simulated)`);
    } else {
      toast.error("Please log in to buy this product.");
    }
  };

  return (
    <motion.div
      className="product-info p-6 md:p-8 bg-[#111827] rounded-xl border border-gray-700 shadow-lg flex flex-col justify-between"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div>
        <motion.p
          className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent mb-4"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          ${product.price}
        </motion.p>
        <motion.p
          className="text-gray-300 leading-relaxed mb-6"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {product.description || "No description available."}
        </motion.p>
      </div>

      <motion.button
        onClick={handleBuyClick}
        className={`w-full px-6 py-3 rounded-lg font-semibold text-white transition-colors duration-300 ${isAuthenticated ? 'bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 shadow-lg' : 'bg-gray-600 cursor-not-allowed'}`}
        variants={buttonVariants}
        whileHover={isAuthenticated ? "hover" : ""}
        whileTap={isAuthenticated ? "tap" : ""}
        disabled={!isAuthenticated}
      >
        {isAuthenticated ? 'Buy Product' : 'Login to Access'}
      </motion.button>
    </motion.div>
  );
};

export default ProductInfo;
