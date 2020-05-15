----------------------DROP TABLES------------------------
DROP TABLE IF EXISTS work_orders;
DROP TABLE IF EXISTS repair_orders;
DROP TABLE IF EXISTS work_tasks;
DROP TABLE IF EXISTS mechanics;
DROP TABLE IF EXISTS cars;
DROP TABLE IF EXISTS customers;
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
<<<<<<< HEAD
=======

-- INSERT customers --
INSERT INTO customers(f_name, l_name, contact_no, email_address) VALUES 
('Chris', 'Nelson', '398-394-0383', 'cnelson@gmail.com'), 
('Heather', 'Fillerup', '398-234-5467', 'genius@ymail.com'), 
('Simon', 'Garfunky', '398-938-9383', 'sg4life@nasa.com'),
('Austin', 'Powers', '398-440-1969', 'groovybaby@yea.com'),
('Neil', 'Hamburger', '398-297-1983', 'comics@yahoo.com'),
('Steph', 'Bologna', '398-938-9383', 'stephB89@gmail.com'),
('Randy', 'Savage', '398-332-1817', 'macho@fakemail.com');
>>>>>>> 403e7c9d88546ee970be411270607d2a186478d6
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
<<<<<<< HEAD
=======

-- test insert into cars --
INSERT INTO cars(customer_id, license_plate, make, model_name, model_year) VALUES 
((SELECT id FROM customers WHERE id = 1), 'tbh-002', 'Ferrari', '488', '2019'),
((SELECT id FROM customers WHERE id = 2), 'bad-124', 'Fiat', '500', '2014'),
((SELECT id FROM customers WHERE id = 3), 'djh-459', 'Honda', 'Civic', '2006'),
((SELECT id FROM customers WHERE id = 4), 'fjd-109', 'Toyota', 'Truck', '1981'),
((SELECT id FROM customers WHERE id = 5), 'dkh-589', 'Saab', '930', '2001'),
((SELECT id FROM customers WHERE id = 6), 'amc-100', 'Lincoln', 'Navigator', '2002'),
((SELECT id FROM customers WHERE id = 7), 'mko-838', 'Lotus', 'Elise', '2011'),
((SELECT id FROM customers WHERE id = 1), 'xsq-283', 'Tesla', 'Model 3', '2019'),
((SELECT id FROM customers WHERE id = 2), 'axx-223', 'Mazda', 'Miata', '204');
>>>>>>> 403e7c9d88546ee970be411270607d2a186478d6
-------------------------CARS---------------------------

--------------------REPAIR ORDERS------------------------
CREATE TABLE repair_orders(
id INT AUTO_INCREMENT UNIQUE PRIMARY KEY NOT NULL,
car_id INT,
date_received DATE,
date_completed DATE,
FOREIGN KEY (car_id) REFERENCES cars(id)
);
<<<<<<< HEAD
=======

-- test insert into repair_orders --
INSERT INTO repair_orders(car_id, date_received) VALUES
((SELECT id FROM cars WHERE license_plate = 'tbh-002'), '2020-05-02'),
((SELECT id FROM cars WHERE license_plate = 'bad-124'), '2020-05-10'),
((SELECT id FROM cars WHERE license_plate = 'djh-459'), '2020-05-11'),
((SELECT id FROM cars WHERE license_plate = 'fjd-109'), '2020-05-12'),
((SELECT id FROM cars WHERE license_plate = 'axx-223'), '2020-05-13');

>>>>>>> 403e7c9d88546ee970be411270607d2a186478d6
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

<<<<<<< HEAD
=======
-- test insert int mechanics --
INSERT INTO mechanics(f_name, l_name) VALUES ('Jake', 'Tiger'), ('Bob', 'Painter'), ('Tommy', 'Boyd'), ('Rob', 'Stump'), ('Pam', 'Simpson');

>>>>>>> 403e7c9d88546ee970be411270607d2a186478d6
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
FOREIGN KEY (mechanic_id) REFERENCES mechanics(id),
UNIQUE (repair_order_id, work_task_id)
);
<<<<<<< HEAD
----------------------WORK_ORDERS------------------------
=======

-- test insert int work_orders --
INSERT INTO work_orders(repair_order_id, work_task_id, mechanic_id,
start_date) VALUES 
((SELECT id FROM repair_orders WHERE car_id = 1),
(SELECT id FROM work_tasks WHERE name = 'Diagnosis'),
(SELECT id FROM mechanics WHERE f_name = 'Jake' 
AND l_name = 'Tiger'),'2020-05-02'
),
((SELECT id FROM repair_orders WHERE car_id = 2),
(SELECT id FROM work_tasks WHERE name = 'Diagnosis'),
(SELECT id FROM mechanics WHERE f_name = 'Tommy' 
AND l_name = 'Boyd'),'2020-05-05'
),
((SELECT id FROM repair_orders WHERE car_id = 3),
(SELECT id FROM work_tasks WHERE name = 'Diagnosis'),
(SELECT id FROM mechanics WHERE f_name = 'Rob' 
AND l_name = 'Stump'),'2020-05-07'
),
((SELECT id FROM repair_orders WHERE car_id = 4),
(SELECT id FROM work_tasks WHERE name = 'Diagnosis'),
(SELECT id FROM mechanics WHERE f_name = 'Jake' 
AND l_name = 'Tiger'),'2020-05-02'
),
((SELECT id FROM repair_orders WHERE car_id = 1),
(SELECT id FROM work_tasks WHERE name = 'Customer Approval'),
(SELECT id FROM mechanics WHERE f_name = 'Pam' 
AND l_name = 'Simpson'),'2020-05-04'
),
((SELECT id FROM repair_orders WHERE car_id = 1),
(SELECT id FROM work_tasks WHERE name = 'Repair'),
(SELECT id FROM mechanics WHERE f_name = 'Pam' 
AND l_name = 'Simpson'),'2020-05-08'
),
((SELECT id FROM repair_orders WHERE car_id = 2),
(SELECT id FROM work_tasks WHERE name = 'Customer Approval'),
(SELECT id FROM mechanics WHERE f_name = 'Rob' 
AND l_name = 'Stump'),'2020-05-07'
); 
----------------------WORK_ORDERS------------------------





SELECT CONCAT(customers.f_name, ' ', customers.l_name) AS customer_name,
work_tasks.name AS work_task, work_tasks.id AS work_task_id, work_orders.start_date
AS start_date, CONCAT(mechanics.f_name, ' ', mechanics.l_name) AS mechanic_name
FROM repair_orders JOIN cars ON repair_orders.car_id = cars.id
JOIN customers ON cars.customer_id = customers.id
JOIN work_orders ON repair_orders.id = work_orders.repair_order_id
JOIN work_tasks ON work_orders.work_task_id = work_tasks.id
JOIN mechanics ON work_orders.mechanic_id = mechanics.id
GROUP BY work_orders.start_date DESC, customers.f_name, work_tasks.id;











>>>>>>> 403e7c9d88546ee970be411270607d2a186478d6
