import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const containerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const AuthenticatedProductsSection = ({ products, loading, error }) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
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
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {products.map((product) => (
            <motion.div key={product._id} variants={itemVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default AuthenticatedProductsSection;

