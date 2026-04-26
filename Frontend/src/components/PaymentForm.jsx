import { useState, useEffect } from "react";
import PaymentButton from "./PaymentButton";

const PaymentForm = ({ initialAmount = 500 }) => {
  const [amount, setAmount] = useState(initialAmount);

  // Sync when amount comes from CheckoutPage
  useEffect(() => {
    setAmount(initialAmount);
  }, [initialAmount]);

  return (
    <div className="flex flex-col items-center w-full">

      {/* Amount Input */}
      <label className="text-sm text-gray-600 mb-2">
        Enter Amount (₹)
      </label>

      <input
        type="number"
        min="1"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        className="border border-gray-300 p-3 rounded-lg mb-4 w-full text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Payment Button */}
      <PaymentButton amount={amount} />

      {/* Note */}
      <p className="text-xs text-gray-400 mt-3 text-center">
        You will be redirected to secure payment gateway
      </p>
    </div>
  );
};

export default PaymentForm;