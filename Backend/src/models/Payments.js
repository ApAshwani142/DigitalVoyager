import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderId: String,
    paymentId: String,
    signature: String,
    amount: Number,
    status: String,
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);