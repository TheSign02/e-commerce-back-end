import express from "express";
import controller from "../controllers/UserController.js";
const router = express.Router();

// CREATE - POST
router.post("/", controller.postUser);

// READ - GET
router.get("/:id", controller.getUserById);
router.get("/", controller.getUserByEmail);

// UPDATE - PUT
router.put("/:id", controller.updateUser);

// DELETE - DELETE
router.delete("/:id", controller.deleteUser);


export default router;
