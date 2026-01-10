import express from "express";
import { check } from "express-validator";
import auth from "../middleware/auth.js";
import {
  createProduct,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.post(
  "/",
  [
    auth,
    [
      check("name", "Name is required").not().isEmpty(),
      check("price", "Price is required").not().isEmpty(),
    ],
  ],
  createProduct
);

router.get("/", auth, getProducts);

router.get("/:id", auth, getProductById);

router.delete("/:id", auth, deleteProduct);

router.put(
  "/:id",
  [
    auth,
    [
      check("name", "Name is required").not().isEmpty(),
      check("price", "Price is required").not().isEmpty(),
    ],
  ],
  updateProduct
);

export default router;
