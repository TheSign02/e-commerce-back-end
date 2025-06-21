import dotenv from "dotenv";
dotenv.config();

import { Pool } from "pg";
import express from "express";
const app = express();
const port = 3000;

// Database Connection Config
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
};

const pool = new Pool(dbConfig);

pool
  .connect()
  .then(() => console.log("Connected to PostgreSQL database"))
  .catch((err) => console.error("Connection error", err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log({ error: error.message })
  }
});

app.get("/orders", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM orders");
    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log({ error: error.message })
  }
});

app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log({ error: error.message })
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
