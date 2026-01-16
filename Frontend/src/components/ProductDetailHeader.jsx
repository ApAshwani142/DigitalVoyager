import React from 'react';
import { motion } from 'framer-motion';

const ProductDetailHeader = ({ productName }) => {
  return (
    <motion.h1 
      className="text-3xl md:text-4xl font-extrabold mb-8 text-center text-white"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      {productName}
    </motion.h1>
  );
};

export default ProductDetailHeader;

