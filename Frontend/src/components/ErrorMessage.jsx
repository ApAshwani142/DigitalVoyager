import React from 'react';
import { motion } from 'framer-motion';

const errorMessageVariants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
};

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[30vh] text-red-400 bg-red-900 bg-opacity-30 p-6 rounded-lg shadow-md max-w-md mx-auto my-10"
      variants={errorMessageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <p className="text-xl font-semibold text-center">Error:</p>
      <p className="mt-2 text-lg text-center">{message}</p>
    </motion.div>
  );
};

export default ErrorMessage;
