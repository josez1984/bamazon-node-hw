DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT AUTO_INCREMENT,
  product_name VARCHAR(255) NOT NULL,
  department_name VARCHAR(255) NOT NULL,
  price DOUBLE NOT NULL,
  stock_quantity integer NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("IPhone 6", "SmartPhones", 599.99, 50),
("IPad", "Tablets", 499.99, 100),
("Iphone Charger", "SmartPhone Accs.", 25.00, 1000),
("Pioneer DDJ1000", "DJ Equipment", 1299.00, 100),
("Denon DJ MCX8000", "DJ Equipment", 1299.00, 95),
("Roku HD", "Media Players", 49.99, 250),
("Microsoft Surface Pro", "Laptops", 799.00, 740),
("Samsung 256GB SSD", "Components", 134.00, 500),
("XBox One X Scorpio Edition", "Video Games", 499.00, 25),
("SNES Mini", "Video Games", 79.99, 50);

SELECT * FROM products;
