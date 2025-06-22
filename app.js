import express from "express";
import userRoute from "./routes/User.js";
const app = express();
const port = 3000;

// JSON Middleware
app.use(express.json());

// Routes
app.use("/user", userRoute);

app.listen((port), () => {
  console.log(`Server running at http://localhost:${port}`);
});
