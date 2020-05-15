----------------------DROP TABLES------------------------
DROP TABLE IF EXISTS work_orders;
DROP TABLE IF EXISTS repair_orders;
DROP TABLE IF EXISTS cars;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS mechanics;
DROP TABLE IF EXISTS work_tasks;
----------------------DROP TABLES------------------------

-----------------------CUSTOMERS------------------------
CREATE TABLE customers(
id INT AUTO_INCREMENT UNIQUE PRIMARY KEY NOT NULL,
f_name VARCHAR(255) NOT NULL,
l_name VARCHAR(255) NOT NULL,
contact_no VARCHAR(20) NOT NULL,
email_address VARCHAR(255) NOT NULL,
UNIQUE (f_name, l_name)
);
-----------------------CUSTOMERS------------------------

-------------------------CARS---------------------------
CREATE TABLE cars(
id INT AUTO_INCREMENT UNIQUE PRIMARY KEY NOT NULL,
customer_id INT,
license_plate VARCHAR(255) NOT NULL,
make VARCHAR(255) NOT NULL,
model_name VARCHAR(255) NOT NULL,
model_year YEAR NOT NULL,
FOREIGN KEY (customer_id) REFERENCES customers(id)
);
-------------------------CARS---------------------------

--------------------REPAIR ORDERS------------------------
CREATE TABLE repair_orders(
id INT AUTO_INCREMENT UNIQUE PRIMARY KEY NOT NULL,
car_id INT,
date_received DATE,
date_completed DATE,
FOREIGN KEY (car_id) REFERENCES cars(id)
);
--------------------REPAIR ORDERS------------------------

----------------------WORK_TASKS-------------------------
CREATE TABLE work_tasks(
id INT AUTO_INCREMENT UNIQUE PRIMARY KEY NOT NULL,
name VARCHAR(255) NOT NULL
);

----------------------WORK_TASKS-------------------------


-----------------------MECHANICS-------------------------
CREATE TABLE mechanics(
id INT AUTO_INCREMENT UNIQUE PRIMARY KEY NOT NULL,
f_name VARCHAR(255) NOT NULL,
l_name VARCHAR(255) NOT NULL,
UNIQUE (f_name, l_name)
);

-----------------------MECHANICS-------------------------

----------------------WORK_ORDERS------------------------
CREATE TABLE work_orders(
id INT AUTO_INCREMENT UNIQUE PRIMARY KEY NOT NULL, 
repair_order_id INT NOT NULL,
work_task_id INT NOT NULL,
mechanic_id INT NOT NULL,
start_date DATE,
end_date DATE,
FOREIGN KEY (repair_order_id) REFERENCES repair_orders(id),
FOREIGN KEY (work_task_id) REFERENCES work_tasks(id),
FOREIGN KEY (mechanic_id) REFERENCES mechanics(id)
);
----------------------WORK_ORDERS------------------------
