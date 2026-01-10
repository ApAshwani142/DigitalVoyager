import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      toast.info("Please log in to view product details.");
    } else {
      navigate(`/products/${product._id}`);
    }
  };

  const buttonClickText = isAuthenticated ? "View Details" : "Login to Access";

  const hoverEffect = {
    scale: 1.05,
    boxShadow: "0 0 25px rgba(34,211,238,0.5), 0 0 40px rgba(59,130,246,0.4)",
    borderColor: "rgba(34,211,238,0.6)",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1, boxShadow: "0 0 0 rgba(0,0,0,0)", borderColor: "rgba(0,0,0,0)" }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      whileHover={hoverEffect}
      whileTap={{ scale: 0.97 }}
      className="bg-[#111827] p-6 rounded-2xl shadow-lg border border-gray-800 relative will-change-transform transform-gpu transition-colors duration-300"
    >
      {product.popular && (
        <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-cyan-500 text-white px-3 py-1 text-xs rounded-full shadow-md">
          Most Popular
        </span>
      )}

      <div className="text-4xl text-cyan-400 mb-4">
        {product.icon ? product.icon : (product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-cover rounded-full" /> : "📦")}
      </div>

      <motion.h3 whileHover={{ color: "#38bdf8" }} transition={{ duration: 0.3 }} className="text-xl font-semibold mb-2">
        {product.name}
      </motion.h3>

      <motion.p whileHover={{ color: "#94a3b8" }} transition={{ duration: 0.3 }} className="text-gray-400 mb-4 line-clamp-3">
        {product.description}
      </motion.p>

      <ul className="space-y-2 mb-4">
        {(product.features || []).map((feature, index) => (
          <motion.li
            key={index}
            whileHover={{ x: 5, color: "#22d3ee" }}
            transition={{ duration: 0.25 }}
            className="flex items-center text-gray-300"
          >
            <span className="text-cyan-400 mr-2">•</span> {feature}
          </motion.li>
        ))}
      </ul>

      <motion.p whileHover={{ scale: 1.05, color: "#0ea5e9" }} transition={{ duration: 0.3 }} className="text-cyan-400 font-bold mb-4">
        ${product.price}
      </motion.p>

      <motion.button
        onClick={handleClick}
        whileHover={{
          scale: 1.08,
          boxShadow: "0 0 20px rgba(34,211,238,0.6)",
          backgroundColor: "rgba(14,165,233,0.9)",
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 rounded-lg hover:opacity-90"
      >
        {buttonClickText}
      </motion.button>
    </motion.div>
  );
};

export default ProductCard;
