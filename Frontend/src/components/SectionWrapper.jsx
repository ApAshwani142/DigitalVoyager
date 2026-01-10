import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const SectionWrapper = ({ id, children }) => {
  const { ref, inView } = useInView({
    threshold: 0.4,
    triggerOnce: false,
  });

  const handleScroll = () => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <motion.div
      id={id}
      ref={ref}
      initial={{ opacity: 0.3, filter: "blur(3px)" }}
      animate={{
        opacity: inView ? 1 : 0.3,
        filter: inView ? "blur(0px)" : "blur(3px)",
      }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      onClick={handleScroll}
      className="cursor-pointer"
    >
      {children}
    </motion.div>
  );
};

export default SectionWrapper;
