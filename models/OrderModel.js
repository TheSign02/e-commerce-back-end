import pool from "../config/db.js";

// Find an order by ID
async function getOrderById(id) {
  const result = await pool.query(
    "SELECT order_id, user_id, order_id, order_date FROM orders WHERE order_id = $1",
    [id]
  );
  return result.rows[0];
}

export { getOrderById };
