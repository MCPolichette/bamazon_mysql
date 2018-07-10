DROP DATABASE IF  EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE Products
(
    id INTEGER NOT NULL
    AUTO_INCREMENT,
  item_id INTEGER
    (25) NOT NULL,
  item_name VARCHAR
    (100) NOT NULL,
  department_name VARCHAR
    (100)  NOT NULL,
  item_price DOUBLE
    (10 ,2) NOT NULL,
  stock_qty INTEGER
    (100) NOT NULL,
  PRIMARY KEY
    (id)
);

    INSERT INTO Products
        (item_id, item_name, department_name, item_price, stock_qty)
    VALUES
        (1234043, "Golf Shoes", "Footwear", 125.50, 100);

    INSERT INTO Products
        (item_id, item_name, department_name, item_price, stock_qty)
    VALUES
        (8590234, "Hiking Boots", "Footwear", 175.00, 75);

    INSERT INTO Products
        (item_id, item_name, department_name, item_price, stock_qty)
    VALUES
        (8690425, "Moisture Wicking Socks", "Footwear", 15.75, 34);

    INSERT INTO Products
        (item_id, item_name, department_name, item_price, stock_qty)
    VALUES
        (8673913, "Therapeutic Insoles", "Footwear", 33.25, 15);

    INSERT INTO Products
        (item_id, item_name, department_name, item_price, stock_qty)
    VALUES
        (3859601, "Cargo Shorts", "Outerwear", 34.50, 34);

    INSERT INTO Products
        (item_id, item_name, department_name, item_price, stock_qty)
    VALUES
        (6847492, "Moisture Wicking Shirt", "Outerwear", 63.50, 25);

    INSERT INTO Products
        (item_id, item_name, department_name, item_price, stock_qty)
    VALUES
        (57683940, "Innertube", "Bicycles", 23.75, 12);

    INSERT INTO Products
        (item_id, item_name, department_name, item_price, stock_qty)
    VALUES
        (4758694, "Bicycle", "Bicycles", 403.25, 3);

    INSERT INTO Products
        (item_id, item_name, department_name, item_price, stock_qty)
    VALUES
        (3859675, "Water Filter", "Hydration", 14.50, 300);

    INSERT INTO Products
        (item_id, item_name, department_name, item_price, stock_qty)
    VALUES
        (4810385, "Camp Chef Kitchen", "Outdoor Cookwear", 123.50, 15);

    INSERT INTO Products
        (item_id, item_name, department_name, item_price, stock_qty)
    VALUES
        (58694245, "Camel Back", "Hydration", 33.25, 175);

    INSERT INTO Products
        (item_id, item_name, department_name, item_price, stock_qty)
    VALUES
        (47582940, "Colapsable Bowl", "Outdoor Cookwear", 3.25, 85);