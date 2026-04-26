import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import PaymentForm from "../components/PaymentForm";

const CheckoutPage = () => {
  const { state } = useLocation();

  const productName = state?.productName || "Product";
  const amount = state?.amount || 500;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center px-4">

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg"
      >

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-800">
            Checkout 💳
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Complete your payment securely
          </p>
        </motion.div>

        {/* Dynamic Product Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-100 p-4 rounded-lg mb-6 text-sm text-gray-700"
        >
          <p className="flex justify-between">
            <span>Product:</span>
            <span>{productName}</span>
          </p>

          <p className="flex justify-between">
            <span>Price:</span>
            <span>₹{amount}</span>
          </p>

          <hr className="my-2" />

          <p className="flex justify-between font-semibold text-gray-800">
            <span>Total:</span>
            <span>₹{amount}</span>
          </p>
        </motion.div>

        {/* Payment Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <PaymentForm initialAmount={amount} />
        </motion.div>

        {/* Secure Info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xs text-gray-400 text-center mt-6"
        >
          🔒 Your payment is secured by Razorpay
        </motion.p>

      </motion.div>
    </div>
  );
};

export default CheckoutPage;