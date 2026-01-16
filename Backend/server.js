import "dotenv/config";
import express from "express";
import connectDB from "./src/config/db.js";
import cors from "cors";

import authRoutes from "./src/routes/auth.js";
import productRoutes from "./src/routes/products.js";
import chatRoutes from "./src/routes/chat.js";
import contactRoutes from "./src/routes/contact.js";
import testEmailRoutes from "./src/routes/testEmail.js";

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  "https://dgvoyager.com",
  "https://www.dgvoyager.com",
  "http://dgvoyager.com",
  "http://www.dgvoyager.com",
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }
      
      if (allowedOrigins.includes(origin) || origin.includes('dgvoyager.com')) {
        return callback(null, true);
      }
      
      if (process.env.NODE_ENV === 'production') {
        callback(new Error(`Origin ${origin} is not allowed by CORS policy`));
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['x-auth-token'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.get("/", (req, res) => {
  res.send("API Running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/test-email", testEmailRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
