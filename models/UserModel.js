import pool from "../config/db.js";
import bcrypt from "bcrypt";
const saltRounds = 10;

// Find a user by ID
async function getUserById(id) {
  const result = await pool.query(
    "SELECT user_id, name, email, created_at FROM users WHERE user_id = $1",
    [id]
  );
  return result.rows[0];
}

// Find a user by email
async function getUserByEmail(email) {
  const result = await pool.query(
    "SELECT user_id, name, email, created_at FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0];
}

// Create a new user
async function createUser(name, email, password) {
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const result = await pool.query(
    "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING name, email",
    [name, email, passwordHash]
  );
  return result.rows[0];
}

// Delete existing user
async function deleteUserById(userId) {
  const result = await pool.query(
    "DELETE FROM users WHERE user_id = $1 RETURNING user_id, name, email",
    [userId]
  );
  return result.rows[0];
}

// Update existing user
async function updateUserById(userId, name, email, password) {
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const result = await pool.query(
    "UPDATE users SET name = $1, email = $2, password_hash = $3 WHERE user_id = $4 RETURNING user_id, name, email",
    [name, email, passwordHash, userId]
  );
  return result.rows[0];
}

export {
  createUser,
  getUserByEmail,
  getUserById,
  deleteUserById,
  updateUserById,
};
