import { motion } from "framer-motion";
import { useEffect } from "react";

const SuccessPage = () => {

  useEffect(() => {
    const audio = new Audio("/success.mp3"); 

    // ⏳ Auto redirect after 5 sec
    const timer = setTimeout(() => {
      window.location.href = "/";
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-green-100 to-green-300">

      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-10 rounded-2xl shadow-2xl text-center max-w-md w-full"
      >

        {/* Animated Circle */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="w-20 h-20 mx-auto mb-5 rounded-full bg-green-500 flex items-center justify-center"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white text-4xl"
          >
            ✓
          </motion.span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-2xl font-bold text-gray-800"
        >
          Payment Successful 🎉
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-gray-600 mt-2"
        >
          Your order has been placed successfully.
        </motion.p>

        {/* Details Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="bg-gray-100 p-4 rounded-lg mt-5 text-sm text-gray-700"
        >
          <p><strong>Order ID:</strong> #ORD12345</p>
          <p><strong>Status:</strong> Paid</p>
        </motion.div>

        {/* Redirect Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-xs text-gray-500 mt-4"
        >
          Redirecting to home in 5 seconds...
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="flex justify-center gap-3 mt-6"
        >
          <a
            href="/"
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Home
          </a>

          <a
            href="/orders"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Orders
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SuccessPage;