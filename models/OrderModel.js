import pool from "../config/db.js";
import { getCartByUserId } from "./CartModel.js";

// Post a new order, with items list
async function postOrder(userId) {
  try {
    // Connect to db as a client for transaction
    const client = await pool.connect();
    await client.query("BEGIN");

    // 1/a Get user's cart items
    const cartItems = await getCartByUserId(userId);

    // Validation
    // 1/b Check if cart exists
    if (cartItems.length === 0) {
      throw new Error("Cart is empty or does not exist!");
    }

    // 1/c Check if all items are in stock
    for (const item of cartItems) {
      if (item.quantity > item.stock) {
        throw new Error(`Insufficient item in stock: ${item.name}`);
      }
    }

    // 2. Post an order entry
    const orderResult = await client.query(
      "INSERT INTO orders (user_id) VALUES ($1) RETURNING order_id",
      [userId]
    );
    const order_id = orderResult.rows[0].order_id;

    // 3. Copy from carts_products to orders_products
    for (const item in cartItems) {
      await client.query(
        "INSERT INTO orders_products (order_id, product_id, quantity) VALUES ($1, $2, $3)",
        [order_id, item.product_id, item.quantity]
      );
    }

    // The cart id to use
    const cart_id = cartItems[0].cart_id;

    // 4/a Delete products from carts_products
    await client.query("DELETE FROM carts_products WHERE cart_id = $1", [
      cart_id,
    ]);

    await client.query("COMMIT");

    // 5. Return summary
    const total_price = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return {
      order_id,
      message: "Order created successfully",
      total_items: cartItems.length,
      total_price,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// Find an order by ID
async function getOrderById(id) {
  const result = await pool.query(
    "SELECT order_id, user_id, order_date FROM orders WHERE order_id = $1",
    [id]
  );
  return result.rows[0];
}

export { getOrderById, postOrder };
