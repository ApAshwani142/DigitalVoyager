import loadRazorpay from "../utils/loadRazorpay";

const PaymentButton = ({ amount }) => {

  const handlePayment = async () => {
    const isLoaded = await loadRazorpay();

    if (!isLoaded) {
      alert("Razorpay SDK failed to load");
      return;
    }

    // 1️⃣ Create order
    const orderRes = await fetch("http://localhost:5000/api/payment/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    });

    const order = await orderRes.json();

    // 2️⃣ Open Razorpay
    const options = {
      key: "rzp_test_xxxxx",
      amount: order.amount,
      currency: "INR",
      name: "Bhoomi Builders",
      description: "Test Payment",
      order_id: order.id,

      handler: async function (response) {
        // 3️⃣ Verify payment
        await fetch("http://localhost:5000/api/payment/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...response,
            amount: order.amount,
          }),
        });

        window.location.href = "/success";
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
    paymentObject.open();
  };

  return (
    <button onClick={handlePayment} style={styles.button}>
      Pay ₹{amount}
    </button>
  );
};

const styles = {
  button: {
    padding: "12px 20px",
    background: "#3399cc",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default PaymentButton;