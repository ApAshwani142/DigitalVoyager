import express from "express";
import { check } from "express-validator";
import { sendContactMessage } from "../controllers/contactController.js";

const router = express.Router();

router.post(
  "/send",
  [
    check("name", "Name is required").notEmpty(),
    check("email", "Valid email is required").isEmail(),
    check("message", "Message is required").notEmpty(),
  ],
  sendContactMessage
);

export default router;