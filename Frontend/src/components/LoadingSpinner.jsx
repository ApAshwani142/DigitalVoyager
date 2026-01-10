import React from 'react';
import { motion } from 'framer-motion';

const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: { duration: 1, ease: "linear", repeat: Infinity },
  },
};

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-400">
      <motion.div
        className="w-12 h-12 border-4 border-t-4 border-blue-500 border-t-transparent rounded-full"
        variants={spinnerVariants}
        animate="animate"
      ></motion.div>
      <p className="mt-4 text-lg font-medium text-white">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
