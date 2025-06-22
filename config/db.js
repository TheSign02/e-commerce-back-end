import dotenv from "dotenv";
dotenv.config();
import { Pool } from "pg";

// Database Connection Config
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
};

const pool = new Pool(dbConfig);

export default pool;