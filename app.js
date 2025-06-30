import express from "express";
import UserRoute from "./routes/UserRoute.js";
import OrderRoute from "./routes/OrderRoute.js";
import ProductRoute from "./routes/ProductRoute.js";
import CartRoute from "./routes/CartRoute.js";
const app = express();
const port = 3000;

// JSON Middleware
app.use(express.json());

// Routes
app.use("/user", UserRoute);
app.use("/user", CartRoute); // each user can have only one cart, hence the user-centric approach
app.use("/order", OrderRoute);
app.use("/product", ProductRoute);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
