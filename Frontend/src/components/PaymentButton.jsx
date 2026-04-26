import loadRazorpay from "../utils/loadRazorpay";

const PaymentButton = ({ amount }) => {
  const API_URL = import.meta.env.VITE_API_URL;

  const handlePayment = async () => {
    try {
      const isLoaded = await loadRazorpay();

      if (!isLoaded) {
        alert("Razorpay SDK failed to load");
        return;
      }

      // ✅ Create order
      const orderRes = await fetch(`${API_URL}/api/payment/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      if (!orderRes.ok) {
        throw new Error("Failed to create order");
      }

      const order = await orderRes.json();

      if (!order || !order.id) {
        throw new Error("Invalid order response from server");
      }

      // ✅ Razorpay options
      const options = {
        key: "rzp_test_SiAYtvmzgQCqdm", 
        amount: order.amount,
        currency: "INR",
        name: "Digital Voyager",
        description: "Payment for service",
        order_id: order.id,

        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${API_URL}/api/payment/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...response,
                amount: order.amount,
              }),
            });

            if (!verifyRes.ok) {
              throw new Error("Payment verification failed");
            }

            //Success redirect
            window.location.href = "/success";
          } catch (err) {
            console.error("Verification Error:", err);
            alert("Payment verification failed, but payment may be successful.");
          }
        },

        prefill: {
          name: "Ashwani",
          email: "test@example.com",
        },

        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.on("payment.failed", function (response) {
        console.error("Payment Failed:", response.error);
        alert("Payment failed. Please try again.");
      });

      paymentObject.open();

    } catch (err) {
      console.error("Payment Error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition duration-300 shadow-md"
    >
      Pay ${amount}
    </button>
  );
};

export default PaymentButton;