import {
  deleteFromCartByUserId,
  getCartByUserId,
  postCartByUserId,
  updateCartByUserId,
} from "../models/CartModel.js";

export default {
  // Post cart by userId
  postCartByUserId: async (req, res) => {
    try {
      const userId = req.params.userId;
      const result = await postCartByUserId(userId);

      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // Get cart by userId
  getCartByUserId: async (req, res) => {
    try {
      const userId = req.params.userId;
      const result = await getCartByUserId(userId);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // Update cart by userId
  updateCartByUserId: async (req, res) => {
    try {
      const userId = req.params.userId;
      const { product_id, quantity } = req.body;
      const result = await updateCartByUserId(userId, product_id, quantity);

      if (result.length === 0) {
        return res.status(404).json({ message: "Cart or Product not found" });
      }

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // Delete from cart by userId and productId
  deleteFromCartByUserId: async (req, res) => {
    try {
      const userId = req.params.userId;
      const { productId } = req.query;
      const result = await deleteFromCartByUserId(userId, productId);

      if (!result) {
        return res.status(404).json({ message: "Product in cart not found" });
      }

      res.status(204).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
