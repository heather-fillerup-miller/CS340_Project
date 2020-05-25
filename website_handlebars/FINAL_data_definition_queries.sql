-- -------------------------------------------------------
-- CREATE TABLES
-- -------------------------------------------------------


-- -------------------- DROP TABLES------------------------
DROP TABLE IF EXISTS work_orders;
DROP TABLE IF EXISTS repair_orders;
DROP TABLE IF EXISTS work_tasks;
DROP TABLE IF EXISTS mechanics;
DROP TABLE IF EXISTS cars;
DROP TABLE IF EXISTS customers;
-- -------------------- DROP TABLES------------------------

-- --------------------- CUSTOMERS------------------------
CREATE TABLE customers(
id INT AUTO_INCREMENT UNIQUE NOT NULL,
f_name VARCHAR(255) NOT NULL,
l_name VARCHAR(255) NOT NULL,
contact_no VARCHAR(20) NOT NULL,
email_address VARCHAR(255) NOT NULL,
PRIMARY KEY (id),
UNIQUE (f_name, l_name)
);
-- --------------------- CUSTOMERS------------------------

-- NULLABLE RELATIONSHIP
-- ----------------------- CARS---------------------------
CREATE TABLE cars(
id INT AUTO_INCREMENT UNIQUE NOT NULL,
customer_id INT,
license_plate VARCHAR(255) NOT NULL,
model_year YEAR NOT NULL,
make VARCHAR(255) NOT NULL,
model_name VARCHAR(255) NOT NULL,
PRIMARY KEY (id)-- ,
-- FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);
-- ----------------------- CARS---------------------------

-- -------------------- WORK_TASKS-------------------------
CREATE TABLE work_tasks(
id INT AUTO_INCREMENT UNIQUE NOT NULL,
name VARCHAR(255) NOT NULL,
PRIMARY KEY (id)
);
-- -------------------- WORK_TASKS-------------------------


-- --------------------- MECHANICS-------------------------
CREATE TABLE mechanics(
id INT AUTO_INCREMENT UNIQUE NOT NULL,
f_name VARCHAR(255) NOT NULL,
l_name VARCHAR(255) NOT NULL,
PRIMARY KEY (id),
UNIQUE (f_name, l_name)
);
-- --------------------- MECHANICS-------------------------

-- ------------------ REPAIR ORDERS------------------------
CREATE TABLE repair_orders(
id INT AUTO_INCREMENT UNIQUE NOT NULL,
car_id INT,
date_received DATE NOT NULL,
date_completed DATE DEFAULT NULL,
PRIMARY KEY (id),
FOREIGN KEY (car_id) REFERENCES cars(id)
);
-- ------------------ REPAIR ORDERS------------------------

-- -------------------- WORK_ORDERS------------------------
CREATE TABLE work_orders(
id INT AUTO_INCREMENT UNIQUE NOT NULL, 
repair_order_id INT NOT NULL,
work_task_id INT NOT NULL,
mechanic_id INT NOT NULL,
start_date DATE NOT NULL,
end_date DATE DEFAULT NULL,
PRIMARY KEY (id),
FOREIGN KEY (repair_order_id) REFERENCES repair_orders(id),
FOREIGN KEY (work_task_id) REFERENCES work_tasks(id),
FOREIGN KEY (mechanic_id) REFERENCES mechanics(id),
UNIQUE (repair_order_id, work_task_id)
);
-- -------------------- WORK_ORDERS------------------------


-- -------------------------------------------------------
-- POPULATE TABLES            
-- -------------------------------------------------------

-- --------------------- CUSTOMERS------------------------
INSERT INTO customers(f_name, l_name, contact_no, email_address) VALUES 
('Chris', 'Nelson', '398-394-0383', 'cnelson@gmail.com'), 
('Heather', 'Fillerup', '398-234-5467', 'genius@ymail.com'), 
('Simon', 'Garfunky', '398-938-9383', 'sg4life@nasa.com'),
('Austin', 'Powers', '398-440-1969', 'groovybaby@yea.com'),
('Neil', 'Hamburger', '398-297-1983', 'comics@yahoo.com'),
('Steph', 'Bologna', '398-938-9383', 'stephB89@gmail.com'),
('Randy', 'Savage', '398-332-1817', 'macho@fakemail.com');


-- ----------------------- CARS---------------------------
INSERT INTO cars(customer_id, license_plate, make, model_name, model_year) VALUES 
((SELECT id FROM customers WHERE id = 1), 'tbh-002', 'Ferrari', '488', '2019'),
((SELECT id FROM customers WHERE id = 2), 'bad-124', 'Fiat', '500', '2014'),
((SELECT id FROM customers WHERE id = 3), 'djh-459', 'Honda', 'Civic', '2006'),
((SELECT id FROM customers WHERE id = 4), 'fjd-109', 'Toyota', 'Truck', '1981'),
((SELECT id FROM customers WHERE id = 5), 'dkh-589', 'Saab', '930', '2001'),
((SELECT id FROM customers WHERE id = 6), 'amc-100', 'Lincoln', 'Navigator', '2002'),
((SELECT id FROM customers WHERE id = 7), 'mko-838', 'Lotus', 'Elise', '2011'),
((SELECT id FROM customers WHERE id = 1), 'xsq-283', 'Tesla', 'Model 3', '2019'),
((SELECT id FROM customers WHERE id = 2), 'axx-223', 'Mazda', 'Miata', '2014');


-- ------------------ REPAIR ORDERS------------------------
INSERT INTO repair_orders(car_id, date_received) VALUES
((SELECT id FROM cars WHERE license_plate = 'tbh-002'), '2020-05-02'),
((SELECT id FROM cars WHERE license_plate = 'bad-124'), '2020-05-10'),
((SELECT id FROM cars WHERE license_plate = 'djh-459'), '2020-05-11'),
((SELECT id FROM cars WHERE license_plate = 'fjd-109'), '2020-05-12'),
((SELECT id FROM cars WHERE license_plate = 'axx-223'), '2020-05-13');


-- -------------------- WORK_TASKS-------------------------
INSERT INTO work_tasks(name) VALUES 
('Diagnosis'), ('Customer Approval'), ('Order Parts'), 
('Repair'), ('Test Drive'), ('Contact Customer');


-- --------------------- MECHANICS-------------------------
INSERT INTO mechanics(f_name, l_name) VALUES ('Jake', 'Tiger'), 
('Bob', 'Painter'), ('Tommy', 'Boyd'), ('Rob', 'Stump'), ('Pam', 'Simpson');


-- -------------------- WORK_ORDERS------------------------
INSERT INTO work_orders(repair_order_id, work_task_id, mechanic_id, start_date, end_date) VALUES 
((SELECT id FROM repair_orders WHERE car_id = 1),
(SELECT id FROM work_tasks WHERE name = 'Diagnosis'),
(SELECT id FROM mechanics WHERE f_name = 'Jake' 
AND l_name = 'Tiger'),'2020-05-02', '2020-05-03'
),
((SELECT id FROM repair_orders WHERE car_id = 2),
(SELECT id FROM work_tasks WHERE name = 'Diagnosis'),
(SELECT id FROM mechanics WHERE f_name = 'Tommy' 
AND l_name = 'Boyd'),'2020-05-05', '2020-05-07'
),
((SELECT id FROM repair_orders WHERE car_id = 3),
(SELECT id FROM work_tasks WHERE name = 'Diagnosis'),
(SELECT id FROM mechanics WHERE f_name = 'Rob' 
AND l_name = 'Stump'),'2020-05-07', NULL
),
((SELECT id FROM repair_orders WHERE car_id = 4),
(SELECT id FROM work_tasks WHERE name = 'Diagnosis'),
(SELECT id FROM mechanics WHERE f_name = 'Jake' 
AND l_name = 'Tiger'),'2020-05-02', NULL
),
((SELECT id FROM repair_orders WHERE car_id = 1),
(SELECT id FROM work_tasks WHERE name = 'Customer Approval'),
(SELECT id FROM mechanics WHERE f_name = 'Pam' 
AND l_name = 'Simpson'),'2020-05-04', '2020-05-04'
),
((SELECT id FROM repair_orders WHERE car_id = 1),
(SELECT id FROM work_tasks WHERE name = 'Repair'),
(SELECT id FROM mechanics WHERE f_name = 'Pam' 
AND l_name = 'Simpson'),'2020-05-08', NULL
),
((SELECT id FROM repair_orders WHERE car_id = 2),
(SELECT id FROM work_tasks WHERE name = 'Customer Approval'),
(SELECT id FROM mechanics WHERE f_name = 'Rob' 
AND l_name = 'Stump'),'2020-05-07', NULL
),
((SELECT id FROM repair_orders WHERE car_id = 9),
(SELECT id FROM work_tasks WHERE name = 'Diagnosis'),
(SELECT id FROM mechanics WHERE f_name = 'Rob' 
AND l_name = 'Stump'),'2020-05-10', NULL
); 


