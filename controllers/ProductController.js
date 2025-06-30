import {
  postProduct,
  deleteProductById,
  getProductById,
  updateProductById,
} from "../models/ProductModel.js";

export default {
  // Get Product by Id
  getProductById: async (req, res) => {
    try {
      const productId = req.params.id;
      const result = await getProductById(productId);

      if (!result) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // Post product
  postProduct: async (req, res) => {
    try {
      const { name, category, price, description, stock } = req.body;
      const result = await postProduct(
        name,
        category,
        price,
        description,
        stock
      );
      res
        .status(201)
        .location(`product/${result.product_id}`)
        .json({
          message: "Product created successfully",
          product: {
            product_id: result.product_id,
            name: result.name,
            category: result.category,
            price: result.price,
            description: result.description,
            stock: result.stock,
            created_at: result.created_at,
          },
        });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // Delete product by id
  deleteProductById: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await deleteProductById(id);
      if (!result) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // Update product by id
  updateProductById: async (req, res) => {
    try {
      const productId = req.params.id;
      const { name, category, price, description, stock } =
        req.body;
      const result = await updateProductById(
        productId,
        name,
        category,
        price,
        description,
        stock
      );

      if (!result) {
        return res.status(404).json({ message: "Product not found" });
      }
      res
        .status(200)
        .json({ message: "Product updated successfully", product: result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
