CREATE SCHEMA app;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(64) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash CHAR(60) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE app.products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category_id INT REFERENCES app.categories(category_id),
    price DECIMAL NOT NULL,
    description TEXT DEFAULT 'No description',
    stock INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE app.carts (
    cart_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) UNIQUE NOT NULL
);

CREATE TABLE app.carts_products (
    cart_id INTEGER REFERENCES carts(cart_id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(product_id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    PRIMARY KEY (cart_id, product_id)
);

CREATE TABLE app.orders (
    order_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES app.users(user_id)
);

CREATE TABLE app.orders_products (
    order_id INTEGER REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(product_id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    PRIMARY KEY (order_id, product_id)
);

CREATE TABLE app.categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
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
BEFORE UPDATE ON app.carts -- for users and products
FOR EACH ROW
EXECUTE FUNCTION update_modified_at();

-- insert into products
INSERT INTO app.products (name, price, description, stock)
VALUES ('Test Object 3', 15.99, 'Third Test Object', 3);

SELECT * FROM products;

-- insert into orders
INSERT INTO app.orders (user_id)
VALUES (3);

-- insert into orders_products
INSERT INTO orders_products (order_id, product_id, quantity)
VALUES (1, 3, 50);
SELECT * FROM orders_products;

SELECT SUM(quantity * price) AS total_price
FROM orders_products
JOIN products
ON orders_products.product_id = products.product_id;

-- extention for fuzzy search
CREATE EXTENSION IF NOT EXISTS pg_trgm; --trigram-based searching—allowing

-- create index for fuzzy search
CREATE INDEX IF NOT EXISTS idx_products_category_trgm
ON products
USING gin (category gin_trgm_ops);


-- SELECTs
SELECT * FROM users;
SELECT * FROM products;
SELECT * FROM carts;
SELECT * FROM carts_products;
SELECT * FROM orders;
SELECT * FROM orders_products;

INSERT INTO carts_products (cart_id, product_id, quantity)
VALUES (1, 1, 3);