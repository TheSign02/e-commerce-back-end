import express from "express";
import controller from "../controllers/OrderController.js";
const router = express.Router();

// GET - READ
router.get("/:id", controller.getOrderById)

export default router;