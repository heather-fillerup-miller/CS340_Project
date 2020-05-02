CREATE TABLE customers(
id INT AUTO_INCREMENT UNIQUE PRIMARY KEY NOT NULL,
f_name VARCHAR(255) NOT NULL,
l_name VARCHAR(255) NOT NULL,
contact_no VARCHAR(20) NOT NULL,
email_address VARCHAR(255) NOT NULL
);

INSERT INTO customers(f_name, l_name, contact_no, email_address) VALUES ('Chris', 'Nelson', '555-394-0383', 
'silly@goofy.com');

INSERT INTO customers(f_name, l_name, contact_no, email_address) VALUES ('Heather', 'Fillerup', '555-873-3837', 
'funny@whacky.com');

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
(SELECT id FROM customers WHERE f_name = 'Chris' AND l_name = 'Nelson'), 
'bgi-4589', 'Honda', 'Civic', '2006', "Daily driver");

INSERT INTO cars(customer_id, license_plate, make, model_name,
model_year, description) VALUES (
(SELECT id FROM customers WHERE f_name = 'Chris' AND l_name = 'Nelson'), 
'fgs-9098', 'McClaren', 'P1', '2018', "Weekend Driver");

INSERT INTO cars(customer_id, license_plate, make, model_name,
model_year, description) VALUES (
(SELECT id FROM customers WHERE f_name = 'Heather' AND l_name = 'Fillerup'), 
'hnd-3029', 'Alpha Romeo', 'Giulia', '2020', "wow");

INSERT INTO cars(customer_id, license_plate, make, model_name,
model_year, description) VALUES (
(SELECT id FROM customers WHERE f_name = 'Heather' AND l_name = 'Fillerup'), 
'ahs-0998', 'Ford', 'Fiest', '1980', "oh yea");


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

CREATE TABLE mechanics(
id INT AUTO_INCREMENT UNIQUE PRIMARY KEY NOT NULL,
f_name VARCHAR(255) NOT NULL,
l_name VARCHAR(255) NOT NULL
);

INSERT INTO mechanics(f_name, l_name) VALUES ('Jake', 'TheSnake');

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

SELECT * FROM customers;
SELECT * FROM cars;
SELECT * FROM repair_orders;
SELECT * FROM work_tasks;
SELECT * FROM mechanics;
SELECT * FROM work_orders;
SELECT * FROM cars JOIN customers ON cars.customer_id = customers.id;
