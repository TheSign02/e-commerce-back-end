import pool from "../config/db.js";

// Find Product by Id
async function getProductById(id) {
  const result = await pool.query(
    "SELECT product_id, name, category, price, description, stock FROM products WHERE product_id = $1",
    [id]
  );
  return result.rows[0];
}

// Find Products by category, using fuzzy search, treshhold can be updated for stricter/looser matching
async function getProductsByCategory(category) {
  const result = await pool.query(
    "SELECT * FROM products WHERE similarity(category, $1) > 0.2 ORDER BY similarity(category, $1) DESC",
    [category]
  );
  return result.rows;
}

// Post product
async function postProduct(name, category, price, description, stock) {
  const result = await pool.query(
    "INSERT INTO products (name, category, price, description, stock) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [name, category, price, description, stock]
  );
  return result.rows[0];
}

// Delete product
async function deleteProductById(id) {
  const result = await pool.query(
    "DELETE FROM products WHERE product_id = $1 RETURNING product_id",
    [id]
  );
  return result.rows[0];
}

// Update product
async function updateProductById(
  product_id,
  name,
  category,
  price,
  description,
  stock
) {
  const result = await pool.query(
    "UPDATE products SET name = $2, category = $3, price = $4, description = $5, stock = $6 WHERE product_id = $1 RETURNING *",
    [product_id, name, category, price, description, stock]
  );
  return result.rows[0];
}

export {
  getProductById,
  getProductsByCategory,
  postProduct,
  deleteProductById,
  updateProductById,
};
