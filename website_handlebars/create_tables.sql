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

-- INSERT customers --
INSERT INTO customers(f_name, l_name, contact_no, email_address) VALUES ('chris', 'nelson', '555-394-0383', 
'silly@goofy.com'), ('heather', 'fillerup', '808-234-5467', 
'genius@smart.com'), ('simon', 'garfunky', '098-938-9383', '^^ ignore this ^^ @spaceisfake.com');
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

-- test insert into cars --
INSERT INTO cars(customer_id, license_plate, make, model_name,
model_year) VALUES 
((SELECT id FROM customers WHERE f_name = 'chris' AND l_name = 'nelson'), 
'tbh-0012', 'Ferrari', '488', '2019'),
((SELECT id FROM customers WHERE f_name = 'chris' AND l_name = 'nelson'), 
'bgi-4589', 'Honda', 'Civic', '2006'),
((SELECT id FROM customers WHERE f_name = 'heather' AND l_name = 'fillerup'), 
'bad-1234', 'Fiat', '500', '2014');
-------------------------CARS---------------------------

--------------------REPAIR ORDERS------------------------
CREATE TABLE repair_orders(
id INT AUTO_INCREMENT UNIQUE PRIMARY KEY NOT NULL,
car_id INT,
date_received DATE,
date_completed DATE,
FOREIGN KEY (car_id) REFERENCES cars(id)
);

-- test insert into repair_orders --
INSERT INTO repair_orders(car_id, date_received) VALUES
((SELECT id FROM cars WHERE license_plate = 'bgi-4589'), '2020-05-02'),
((SELECT id FROM cars WHERE license_plate = 'tbh-0012'), '2020-05-05');

--------------------REPAIR ORDERS------------------------

----------------------WORK_TASKS-------------------------
CREATE TABLE work_tasks(
id INT AUTO_INCREMENT UNIQUE PRIMARY KEY NOT NULL,
name VARCHAR(255) NOT NULL
);

-- test insert into work_tasks --
INSERT INTO work_tasks(name) VALUES 
('Diagnosis'), ('Customer Approval'), ('Order Parts'), ('Repair'), ('Test Drive'), ('Contact Customer');

----------------------WORK_TASKS-------------------------


-----------------------MECHANICS-------------------------
CREATE TABLE mechanics(
id INT AUTO_INCREMENT UNIQUE PRIMARY KEY NOT NULL,
f_name VARCHAR(255) NOT NULL,
l_name VARCHAR(255) NOT NULL,
UNIQUE (f_name, l_name)
);

-- test insert int mechanics --
INSERT INTO mechanics(f_name, l_name) VALUES ('Jake', 'TheSnake'), ('bob', 'painter');

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

-- test insert int work_orders --
INSERT INTO work_orders(repair_order_id, work_task_id, mechanic_id,
start_date) VALUES 
((SELECT id FROM repair_orders WHERE car_id = 1),
(SELECT id FROM work_tasks WHERE name = 'Diagnosis'),
(SELECT id FROM mechanics WHERE f_name = 'Jake' 
AND l_name = 'TheSnake'),'2020-05-02'
),
((SELECT id FROM repair_orders WHERE car_id = 2),
(SELECT id FROM work_tasks WHERE name = 'Diagnosis'),
(SELECT id FROM mechanics WHERE f_name = 'bob' 
AND l_name = 'painter'),'2020-05-05'
); 
----------------------WORK_ORDERS------------------------





SELECT customers.f_name AS first_name, customers.l_name AS last_name,
work_tasks.name AS work_task, work_orders.start_date
AS start_date, mechanics.f_name AS mechanic_f_name, mechanics.l_name AS mechanic_l_name
FROM repair_orders JOIN cars ON repair_orders.car_id = cars.id
JOIN customers ON cars.customer_id = customers.id
JOIN work_orders ON repair_orders.id = work_orders.repair_order_id
JOIN work_tasks ON work_orders.work_task_id = work_tasks.id
JOIN mechanics ON work_orders.mechanic_id = mechanics.id;











