import pool from "../config/db.js";

// Post into carts, based on user id, for creating a new cart
async function postCartByUserId(user_id) {
  const result = await pool.query(
    "INSERT INTO carts (user_id) VALUES ($1) RETURNING *",
    [user_id]
  );

  return result.rows;
}

// Get cart based on userId
async function getCartByUserId(user_id) {
  const result = await pool.query(
    "SELECT p.product_id, p.name, p.price, p.description, p.stock, cp.quantity FROM carts c JOIN carts_products cp ON c.cart_id = cp.cart_id JOIN products p ON cp.product_id = p.product_id WHERE c.user_id = $1",
    [user_id]
  );
  return result.rows;
}

// Update carts content based on userId
async function updateCartByUserId(user_id, product_id, quantity) {
  // 1. Check if user has a cart
  const cartResult = await pool.query(
    "SELECT cart_id FROM carts WHERE user_id = $1",
    [user_id]
  );

  let cart_id;
  if (cartResult.rows.length === 0) {
    // 2. If user has no cart, create one
    const newCartResult = await pool.query(
      "INSERT INTO carts (user_id) VALUES ($1) RETURNING cart_id",
      [user_id]
    );
    cart_id = newCartResult.rows[0].cart_id; // new cart id
  } else {
    cart_id = cartResult.rows[0].cart_id; // existing cart id
  }

  // 3. Delete from the carts_product table if quantity <= 0
  if (quantity <= 0) {
    const result = await pool.query(
      "DELETE FROM carts_products WHERE product_id = $1 RETURNING *",
      [product_id]
    );
    return result.rows;
  }

  // 4. Upsert (insert or update) the product in the cart
  const upsertResult = await pool.query(
    "INSERT INTO carts_products (cart_id, product_id, quantity) VALUES ($1, $2, $3) ON CONFLICT (cart_id, product_id) DO UPDATE SET quantity = EXCLUDED.quantity RETURNING *",
    [cart_id, product_id, quantity]
  );

  return upsertResult.rows;
}

// Delete from cart by userId and productId
async function deleteFromCartByUserId(user_id, product_id){
  const result = await pool.query("DELETE FROM carts_products WHERE cart_id = (SELECT cart_id FROM carts WHERE user_id = $1 LIMIT 1) AND product_id = $2 RETURNING *", [user_id, product_id]);

  return result.rows;
}

export { postCartByUserId, getCartByUserId, updateCartByUserId, deleteFromCartByUserId };
