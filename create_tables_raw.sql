CREATE TABLE customers(
id INT AUTO_INCREMENT UNIQUE PRIMARY KEY NOT NULL,
f_name VARCHAR(255) NOT NULL,
l_name VARCHAR(255) NOT NULL,
contact_no VARCHAR(20) NOT NULL,
email_address VARCHAR(255) NOT NULL
);

INSERT INTO customers(f_name, l_name, contact_no, email_address) VALUES ('chris', 'nelson', '555-394-0383', 
'silly@goofy.com');

INSERT INTO customers(f_name, l_name, contact_no, email_address) VALUES ('heather', 'fillerup', '555-439-3938', 
'funny@huh.com');

INSERT INTO customers(f_name, l_name, contact_no, email_address) VALUES ('ben', 'stiller', '493-322-9999', 
'neb@rellits.com');





SELECT * FROM customers;

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

INSERT INTO cars(customer_id, license_plate, make, model_name,
model_year, description) VALUES (
(SELECT id FROM customers WHERE f_name = 'chris' AND l_name = 'nelson'), 
'bgi-4589', 'Honda', 'Civic', '2006', "Daily driver");


INSERT INTO cars(customer_id, license_plate, make, model_name,
model_year, description) VALUES (
(SELECT id FROM customers WHERE f_name = 'heather' AND l_name = 'fillerup'), 
'dkh-4918', 'Toyota', 'corolla', '2009', "burgandy bomber");

INSERT INTO cars(customer_id, license_plate, make, model_name,
model_year, description) VALUES (
(SELECT id FROM customers WHERE f_name = 'chris' AND l_name = 'nelson'), 
'cck-1019', 'Volkswagon', 'bettle', '2011', "the real deal");

INSERT INTO cars(customer_id, license_plate, make, model_name,
model_year, description) VALUES (
(SELECT id FROM customers WHERE f_name = 'ben' AND l_name = 'stiller'), 
'vgd-1039', 'astin martin', 'DB9', '2019', "the beast");


SELECT * FROM cars;


CREATE TABLE repair_orders(
id INT AUTO_INCREMENT UNIQUE PRIMARY KEY NOT NULL,
car_id INT NOT NULL,
date_received DATE,
date_compeleted DATE,
parts_needed TINYINT NOT NULL DEFAULT 0,
current_status INT NOT NULL DEFAULT 1,
FOREIGN KEY (car_id) REFERENCES cars(id)
);

INSERT INTO repair_orders(car_id, date_received) VALUES (
(SELECT id FROM cars WHERE license_plate = 'bgi-4589'), '2020-05-02');

INSERT INTO repair_orders(car_id, date_received) VALUES (
(SELECT id FROM cars WHERE license_plate = 'cck-1019'), '2020-05-11');

INSERT INTO repair_orders(car_id, date_received) VALUES (
(SELECT id FROM cars WHERE license_plate = 'vgd-1039'), '2020-05-07');


SELECT * FROM repair_orders;

CREATE TABLE work_tasks(
id INT AUTO_INCREMENT UNIQUE PRIMARY KEY NOT NULL,
name VARCHAR(255) NOT NULL
);

INSERT INTO work_tasks(name) VALUES ('Diagnosis');
INSERT INTO work_tasks(name) VALUES ('Customer Approval');
INSERT INTO work_tasks(name) VALUES ('Order Parts');
INSERT INTO work_tasks(name) VALUES ('Repair');
INSERT INTO work_tasks(name) VALUES ('Test Drive');
INSERT INTO work_tasks(name) VALUES ('Contact Customer');

SELECT * FROM work_tasks;

CREATE TABLE mechanics(
id INT AUTO_INCREMENT UNIQUE PRIMARY KEY NOT NULL,
f_name VARCHAR(255) NOT NULL,
l_name VARCHAR(255) NOT NULL
);

INSERT INTO mechanics(f_name, l_name) VALUES ('Jake', 'TheSnake');
INSERT INTO mechanics(f_name, l_name) VALUES ('grim', 'reaper');
INSERT INTO mechanics(f_name, l_name) VALUES ('joe', 'rogan');

SELECT * FROM mechanics;

CREATE TABLE work_orders(
repair_order_id INT NOT NULL,
work_task_id INT NOT NULL,
mechanic_id INT,
start_date DATE,
end_date DATE,
FOREIGN KEY (repair_order_id) REFERENCES repair_orders(id),
FOREIGN KEY (work_task_id) REFERENCES work_tasks(id),
FOREIGN KEY (mechanic_id) REFERENCES mechanics(id)
);

INSERT INTO work_orders(repair_order_id, work_task_id, mechanic_id,
start_date)
VALUES ((SELECT id FROM repair_orders WHERE car_id = 1),
(SELECT id FROM work_tasks WHERE name = 'Diagnosis'),
(SELECT id FROM mechanics WHERE f_name = 'Jake' 
AND l_name = 'TheSnake'),'2020-05-02'
); 

INSERT INTO work_orders(repair_order_id, work_task_id, mechanic_id,
start_date)
VALUES ((SELECT id FROM repair_orders WHERE car_id = 4),
(SELECT id FROM work_tasks WHERE name = 'Diagnosis'),
(SELECT id FROM mechanics WHERE f_name = 'joe' 
AND l_name = 'rogan'),'2020-05-11'
); 

INSERT INTO work_orders(repair_order_id, work_task_id, mechanic_id,
start_date)
VALUES ((SELECT id FROM repair_orders WHERE car_id = 3),
(SELECT id FROM work_tasks WHERE name = 'Diagnosis'),
(SELECT id FROM mechanics WHERE f_name = 'joe' 
AND l_name = 'rogan'),'2020-05-10'
); 

SELECT * FROM work_orders;

SELECT customers.f_name AS first_name, customers.l_name AS last_name, cars.description 
AS car_description FROM customers JOIN cars ON customers.id = cars.customer_id; 








SELECT customers.f_name AS first_name, customers.l_name AS last_name, cars.description 
AS car_description, work_tasks.name  AS work_task, work_orders.start_date 
AS start_date, mechanics.f_name AS mechanic_f_name, mechanics.l_name AS mechanic_l_name
FROM repair_orders JOIN cars ON repair_orders.car_id = cars.id 
JOIN customers ON cars.customer_id = customers.id 
JOIN work_orders ON repair_orders.id = work_orders.repair_order_id
JOIN work_tasks ON work_orders.work_task_id = work_tasks.id
JOIN mechanics ON work_orders.mechanic_id = mechanics.id;





######
SELECT category.name AS category_name,   
COUNT(actor.actor_id) AS number_of_films FROM category
JOIN film_category ON category.category_id = film_category.category_id
JOIN film ON film_category.film_id = film.film_id
JOIN film_actor ON film.film_id = film_actor.film_id
LEFT JOIN actor ON film_actor.actor_id = actor.actor_id AND actor.actor_id = (SELECT actor_id from actor
WHERE actor.first_name = "ED" AND actor.last_name = "CHASE")
GROUP BY category.name ASC;
#####


SELECT customers.f_name AS first_name, customers.l_name AS last_name, cars.description 
AS car_description, work_orders.work_task_id AS work_task, work_orders.start_date 
AS start_date FROM customers JOIN cars.id ON customers.id = cars.id; 




DROP TABLES work_orders;
DROP TABLES mechanics;
DROP TABLES work_tasks;
DROP TABLES repair_orders;
DROP TABLES cars;
DROP TABLES customers;














