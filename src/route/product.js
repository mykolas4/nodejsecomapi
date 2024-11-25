import express from "express";
import auth from "../middleware/auth.js";

import {
  INSERT_PRODUCT,
  SORT_PRODUCT,
  GET_PRODUCT_BY_ID,
  GET_PRODUCTS,
  DELETE_PRODUCT,
  UPDATE_PRODUCT,
} from "../controller/product.js";

const router = express.Router();


router.post("/products/", auth, INSERT_PRODUCT);
router.get("/products/sort",auth, SORT_PRODUCT);
router.get("/products/:id",auth, GET_PRODUCT_BY_ID);
router.get("/products/",auth, GET_PRODUCTS);
router.delete("/products/", auth, DELETE_PRODUCT);
router.put("/products/", auth, UPDATE_PRODUCT);


export default router;
