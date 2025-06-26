import pool from "../config/db";


// Find an order by ID
export async function getOrderById(id) {
  const result = await pool.query(
    "SELECT order_id, user_id, order_id FROM orders WHERE order_id = $1",
    [id]
  );
  return result.rows[0];
}