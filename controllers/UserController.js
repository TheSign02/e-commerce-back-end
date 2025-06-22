import {
  createUser,
  getUserByEmail,
  getUserById,
  deleteUserById,
  updateUserById
} from "../models/UserModel.js";

export default {
  // Get User by Id
  getUserById: async (req, res) => {
    try {
      const userId = req.params.id; // Get ID from URL parameter
      const result = await getUserById(userId);

      if (!result) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // Get User by Email
  getUserByEmail: async (req, res) => {
    try {
      const { email } = req.query;
      const result = await getUserByEmail(email);

      if (!result) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // Create a new user
  postUser: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const result = await createUser(name, email, password);
      res
        .status(201)
        .location(`/user/${result.user_id}`)
        .json({
          message: "User created successfully",
          user: {
            user_id: result.user_id,
            name: result.name,
            email: result.email,
            created_at: result.created_at,
          },
        });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // Delete existing user
  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const deletedUser = await deleteUserById(userId);
      if (!deletedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json({
        message: "User deleted successfully",
        user: deletedUser,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // Update existing user
  updateUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const { name, email, password } = req.body;
      const updatedUser = await updateUserById(userId, name, email, password);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json({
        message: "User updated successfully",
        user: updatedUser
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
