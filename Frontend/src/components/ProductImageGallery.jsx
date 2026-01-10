import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const imageVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
};

const thumbnailVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const ProductImageGallery = ({ images }) => {
  const [mainImage, setMainImage] = useState(images[0] || null);

  useEffect(() => {
    setMainImage(images[0] || null);
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <motion.div
        className="image-placeholder bg-[#111827] border border-gray-700 h-64 md:h-96 flex items-center justify-center rounded-xl shadow-inner"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-gray-400 text-lg">No Image Available</span>
      </motion.div>
    );
  }

  return (
    <div className="product-image-gallery flex flex-col items-center">
      <AnimatePresence mode="wait">
        {mainImage && (
          <motion.div
            key={mainImage}
            className="w-full bg-[#111827] border border-gray-700 rounded-xl p-4 mb-4"
            variants={imageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.img
              src={mainImage}
              alt="Product Main"
              className="w-full max-h-96 object-contain rounded-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {images.length > 1 && (
        <div className="thumbnails flex space-x-2 overflow-x-auto p-2 bg-[#111827] border border-gray-700 rounded-lg shadow-sm">
          {images.map((img, index) => (
            <motion.img
              key={index}
              src={img}
              alt={`Thumbnail ${index + 1}`}
              className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${mainImage === img ? 'border-sky-500' : 'border-transparent hover:border-gray-600'} transition-all duration-200`}
              onClick={() => setMainImage(img)}
              variants={thumbnailVariants}
              initial="initial"
              animate="animate"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
