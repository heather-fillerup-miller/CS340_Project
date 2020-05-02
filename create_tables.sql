-----------------------CUSTOMERS------------------------
CREATE TABLE customers(
id INT AUTO_INCREMENT UNIQUE PRIMARY KEY NOT NULL,
f_name VARCHAR(255) NOT NULL,
l_name VARCHAR(255) NOT NULL,
contact_no VARCHAR(20) NOT NULL,
email_address VARCHAR(255) NOT NULL
);

-- test insert INTo customers --
INSERT INTO customers(f_name, l_name, contact_no, email_address) VALUES ('chris', 'nelson', '555-394-0383', 
'silly@goofy.com');

-- show the customer table --
SELECT * FROM customers;

-----------------------CUSTOMERS------------------------

-------------------------CARS---------------------------
CREATE TABLE cars(
id INT AUTO_INCREMENT UNIQUE PRIMARY KEY NOT NULL,
customer_id INT NOT NULL,
license_plate VARCHAR(255) NOT NULL,
make VARCHAR(255) NOT NULL,
model_name VARCHAR(255) NOT NULL,
model_year YEAR NOT NULL,
description VARCHAR(255),
FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- test insert into cars --
INSERT INTO cars(customer_id, license_plate, make, model_name,
model_year, description) VALUES (
(SELECT id FROM customers WHERE f_name = 'chris' AND l_name = 'nelson'), 
'bgi-4589', 'Honda', 'Civic', '2006', "Daily driver");

-- show the cars table --
SELECT * FROM cars;

-------------------------CARS---------------------------

--------------------REPAIR ORDERS------------------------
CREATE TABLE repair_orders(
id INT AUTO_INCREMENT UNIQUE PRIMARY KEY NOT NULL,
car_id INT NOT NULL,
date_received DATE,
date_compeleted DATE,
parts_needed BOOLEAN NOT NULL DEFAULT 0,
current_status INT NOT NULL DEFAULT 1,
FOREIGN KEY (car_id) REFERENCES cars(id)
);

-- test insert into repair_orders --
INSERT INTO repair_orders(car_id, date_received) VALUES (
(SELECT id FROM cars WHERE license_plate = 'bgi-4589'), '2020-05-02');


-- show the repair_orders table --
SELECT * FROM repair_orders;

--------------------REPAIR ORDERS------------------------

----------------------WORK_TASKS-------------------------
CREATE TABLE work_tasks(
id INT AUTO_INCREMENT UNIQUE PRIMARY KEY NOT NULL,
name VARCHAR(255) NOT NULL
);

-- test insert into repair_orders --
INSERT INTO work_tasks(name) VALUES ('diagnosis');
INSERT INTO work_tasks(name) VALUES ('approval');
INSERT INTO work_tasks(name) VALUES ('parts');
INSERT INTO work_tasks(name) VALUES ('repair');
INSERT INTO work_tasks(name) VALUES ('test');
INSERT INTO work_tasks(name) VALUES ('contact');


-- show the repair_orders table --
SELECT * FROM repair_orders;

----------------------WORK_TASKS-------------------------






















