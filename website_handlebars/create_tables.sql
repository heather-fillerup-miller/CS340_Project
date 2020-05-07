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
'silly@goofy.com'), ('heather', 'fillerup', '808-234-5467', 
'genius@smart.com'), ('simon', 'garfunky', '098-938-9383', '^^ ignore this ^^ @spaceisfake.com');


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
'bgi-4589', 'Fiat', '500', '2014');

--update--
UPDATE cars SET license_plate = 'abc-123' WHERE cars.customer_id = (SELECT customers.id FROM customers WHERE customers.f_name = 'heather' AND customers.l_name = 'fillerup');

-- show the cars table --
SELECT * FROM cars;

-------------------------CARS---------------------------

--------------------REPAIR ORDERS------------------------
CREATE TABLE repair_orders(
id INT AUTO_INCREMENT UNIQUE PRIMARY KEY NOT NULL,
car_id INT NOT NULL,
date_received DATE,
date_compeleted DATE,
parts_needed TINYINT NOT NULL DEFAULT 0,
current_status INT NOT NULL DEFAULT 1,
FOREIGN KEY (car_id) REFERENCES cars(id)
);

-- test insert into repair_orders --
INSERT INTO repair_orders(car_id, date_received) VALUES ((
(SELECT id FROM cars WHERE license_plate = 'bgi-4589'), '2020-05-02'),
((SELECT id FROM cars WHERE license_plate = 'tbh-0012'), '2020-05-05'));



-- show the repair_orders table --
SELECT * FROM repair_orders;

--------------------REPAIR ORDERS------------------------

----------------------WORK_TASKS-------------------------
CREATE TABLE work_tasks(
id INT AUTO_INCREMENT UNIQUE PRIMARY KEY NOT NULL,
name VARCHAR(255) NOT NULL
);

-- test insert into work_tasks --
INSERT INTO work_tasks(name) VALUES ('Diagnosis');
INSERT INTO work_tasks(name) VALUES ('Customer Approval');
INSERT INTO work_tasks(name) VALUES ('Order Parts');
INSERT INTO work_tasks(name) VALUES ('Repair');
INSERT INTO work_tasks(name) VALUES ('Test Drive');
INSERT INTO work_tasks(name) VALUES ('Contact Customer');


-- show the repair_orders table --
SELECT * FROM work_tasks;

----------------------WORK_TASKS-------------------------


-----------------------MECHANICS-------------------------
CREATE TABLE mechanics(
id INT AUTO_INCREMENT UNIQUE PRIMARY KEY NOT NULL,
f_name VARCHAR(255) NOT NULL,
l_name VARCHAR(255) NOT NULL,

UNIQUE (f_name, l_name)
);



-- test insert int mechanics --
INSERT INTO mechanics(f_name, l_name) VALUES ('Jake', 'TheSnake');
INSERT INTO mechanics(f_name, l_name) VALUES ('bob', 'painter');

-- show the mechanics table --
SELECT * FROM mechanics;

-----------------------MECHANICS-------------------------


----------------------WORK_ORDERS------------------------
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

-- test insert int work_orders --
INSERT INTO work_orders(repair_order_id, work_task_id, mechanic_id,
start_date)
VALUES ((SELECT id FROM repair_orders WHERE car_id = 1),
(SELECT id FROM work_tasks WHERE name = 'Diagnosis'),
(SELECT id FROM mechanics WHERE f_name = 'Jake' 
AND l_name = 'TheSnake'),'2020-05-02'
); 

INSERT INTO work_orders(repair_order_id, work_task_id, mechanic_id,
start_date)
VALUES ((SELECT id FROM repair_orders WHERE car_id = 1),
(SELECT id FROM work_tasks WHERE name = 'Diagnosis'),
(SELECT id FROM mechanics WHERE f_name = 'bob' 
AND l_name = 'painter'),'2020-05-05'
); 

-- show the work_orders table --
SELECT * FROM work_orders;

----------------------WORK_ORDERS------------------------

DROP TABLES work_orders;
DROP TABLES mechanics;
DROP TABLES work_tasks;
DROP TABLES repair_orders;
DROP TABLES cars;
DROP TABLES customers;














