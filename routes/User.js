import express from "express";
import controller from "../controllers/UserController.js";
const router = express.Router();

// GET - READ
router.get("/:id", controller.getUserById);
router.get("/", controller.getUserByEmail);

// POST - CREATE
router.post("/", controller.postUser);

// DELETE - DELETE
router.delete("/:id", controller.deleteUser);

// UPDATE - PUT
router.put("/:id", controller.updateUser);

export default router;
