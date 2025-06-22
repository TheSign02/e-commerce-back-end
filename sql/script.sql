CREATE SCHEMA app;

CREATE TABLE app.users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(64) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE app.users
ADD COLUMN modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE app.products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL NOT NULL,
    description TEXT,
    stock INTEGER NOT NULL
);

CREATE TABLE app.orders (
    order_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE orders_products (
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
)

INSERT INTO app.products (name, price, description, stock)
VALUES ('Test Object', 13.99, 'No description', 10);

-- set password
ALTER USER postgres WITH PASSWORD 'postgres';

-- set search_path in order not to always query app.users, just users
ALTER DATABASE postgres SET search_path TO app, public;

SELECT * FROM users;

-- fucntion for trigger
CREATE OR REPLACE FUNCTION update_users_modified_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.modified_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- create trigger from function
CREATE TRIGGER update_users_modified_at
BEFORE UPDATE ON app.users
FOR EACH ROW
EXECUTE FUNCTION update_users_modified_at();