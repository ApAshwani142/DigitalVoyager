import React from 'react';
import { motion } from 'framer-motion';

const ProductDescription = ({ description }) => {
  return (
    <motion.div
      className="mt-12 bg-[#111827] p-6 md:p-8 rounded-xl border border-gray-700 shadow-lg"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
    >
      <h2 className="text-2xl font-bold mb-4 text-white">Product Description</h2>
      <p className="text-gray-300 leading-relaxed">
        {description || "No detailed description available for this product."}
      </p>
    </motion.div>
  );
};

export default ProductDescription;

