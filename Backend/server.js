import "dotenv/config";
import express from "express";
import connectDB from "./src/config/db.js";
import cors from "cors";

import authRoutes from "./src/routes/auth.js";
import productRoutes from "./src/routes/products.js";
import chatRoutes from "./src/routes/chat.js";
import contactRoutes from "./src/routes/contact.js";

const app = express();

// connect to database
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "https://dgvoyager.com",
      "https://www.dgvoyager.com",
      "http://dgvoyager.com",
      "http://www.dgvoyager.com",
      "http://localhost:5173", // For local development
      "http://localhost:3000", // For local development
    ],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("API Running... 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/contact", contactRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
