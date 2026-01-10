import React from "react";
import ProductCard from "./ProductCard";
import { FaSearch, FaExclamationTriangle, FaShieldAlt, FaArrowRight } from "react-icons/fa";
import { hardcodedServices } from "../utils/hardcodedServices";

const ServicesGrid = () => {
  const iconMap = {
    "60d5ec49f85e4d2d4c88e7d1": <FaSearch className="w-8 h-8 text-sky-400" />,
    "60d5ec49f85e4d2d4c88e7d2": <FaExclamationTriangle className="w-8 h-8 text-sky-400" />,
    "60d5ec49f85e4d2d4c88e7d3": <FaShieldAlt className="w-8 h-8 text-sky-400" />,
    "60d5ec49f85e4d2d4c88e7d4": <FaArrowRight className="w-8 h-8 text-sky-400" />,
  };

  const servicesAsProducts = hardcodedServices.map(service => ({
    ...service,
    icon: iconMap[service._id],
  }));

  return (
    <section className="py-12 px-6 md:px-20 grid grid-cols-1 md:grid-cols-3 gap-8">
      {servicesAsProducts.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </section>
  );
};

export default ServicesGrid;
