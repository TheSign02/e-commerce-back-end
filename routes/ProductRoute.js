import express from "express";
import controller from "../controllers/ProductController.js";
const router = express.Router();


// CREATE - POST
router.post("/", controller.postProduct);

// READ - GET
router.get("/:id", controller.getProductById);

// UPDATE - PUT
router.put("/:id", controller.updateProductById);

// DELETE - DELETE
router.delete("/:id", controller.deleteProductById);

export default router;
