import express from "express";
import controller from "../controllers/CartController.js";
const router = express.Router({ mergeParams: true });

// CREATE - POST
router.post("/:userId/cart", controller.postCartByUserId);

// READ - GET
router.get("/:userId/cart", controller.getCartByUserId);

// UPDATE - PUT
router.put("/:userId/cart", controller.updateCartByUserId);

// DELETE - DELETE
router.delete("/:userId/cart", controller.deleteFromCartByUserId);

export default router;
