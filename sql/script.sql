CREATE SCHEMA app;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(64) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash CHAR(60) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE app.products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL NOT NULL,
    description TEXT DEFAULT "No description",
    stock INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE app.orders (
    order_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES app.users(user_id)
);

CREATE TABLE app.orders_products (
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    FOREIGN KEY (order_id) REFERENCES app.orders(order_id),
    FOREIGN KEY (product_id) REFERENCES app.products(product_id)
);

-- set search_path in order not to always query app.users, just users
ALTER DATABASE postgres SET search_path TO app, public;

-- function for trigger: update modified_at
CREATE OR REPLACE FUNCTION update_modified_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.modified_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- create trigger from function above
CREATE TRIGGER update_products_modified_at
BEFORE UPDATE ON app.users
FOR EACH ROW
EXECUTE FUNCTION update_modified_at();

-- insert into products
INSERT INTO app.products (name, price, description, stock)
VALUES ('Test Object 3', 15.99, 'Third Test Object', 3);

SELECT * FROM products;

-- insert into orders
INSERT INTO app.orders (user_id)
VALUES ();