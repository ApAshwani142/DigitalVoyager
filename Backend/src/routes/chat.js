import express from "express";
import { chatWithGemini, testGeminiConnection } from "../controllers/chatController.js";

const router = express.Router();

router.get("/test", testGeminiConnection);
router.post("/", chatWithGemini);

export default router;
