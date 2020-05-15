
-----------------------------------------------------
-- Below is the special character data manipulation 
-- queries.  Included at the end of this document
-- is the actual sql commands for the manipulation
-- if you would like to try it out on mariaDB.
-----------------------------------------------------


--many to many 
--space to make look nice











-----------------------MANIPULATE CUSTOMERS------------------------
SELECT * FROM customers;
INSERT INTO customers(f_name, l_name, contact_no, email_address) VALUES 
('Steve', 'Juststeve', '199-098-9382', 'juststeve@microsoft.com');
SELECT * FROM customers;
UPDATE customers SET l_name = 'Justice' WHERE id = 8;  
SELECT * FROM customers;
DELETE FROM customers WHERE id = 8;
SELECT * FROM customers;

-----------------------MANIPULATE CARS------------------------
SELECT * FROM cars;
--1 to MANY NULLABLE customer_id
INSERT INTO cars(customer_id, license_plate, make, model_name, model_year) VALUES 
((SELECT id FROM customers WHERE id = 1), 'custom', 'Kia', 'Spectrum', '2016');
SELECT * FROM cars;
UPDATE cars SET make = 'Oldsmobile' WHERE 
id = (SELECT id FROM cars WHERE license_plate = 'custom');
SELECT * FROM cars;
DELETE FROM cars WHERE id = 10;
SELECT * FROM cars;

--------------------MANIPULATE REPAIR_ORDERS---------------------
SELECT * FROM repair_orders;
INSERT INTO repair_orders(car_id, date_received) VALUES
((SELECT id FROM cars WHERE license_plate = 'mko-838'), '2020-05-20');
SELECT * FROM repair_orders;
UPDATE repair_orders SET date_received = '2020-05-21' WHERE car_id =
(SELECT car_id FROM cars WHERE cars.license_plate = 'mko-838');
SELECT * FROM repair_orders;


--------------------MANIPULATE WORK_TASKS---------------------
SELECT * FROM work_tasks;
INSERT INTO work_tasks(name) VALUES ('Customer Hold');
SELECT * FROM work_tasks;
UPDATE work_tasks SET name = 'On Hold' WHERE id = (
SELECT id from work_tasks WHERE name = 'Customer Hold');
SELECT * FROM work_tasks;
DELETE FROM work_tasks WHERE id = (SELECT id from work_tasks WHERE name = 'On Hold');
SELECT * FROM work_tasks;


--------------------MANIPULATE MECHANICS---------------------
SELECT * FROM mechanics GROUP BY id ASC;
INSERT INTO mechanics(f_name, l_name) VALUES ('Tim', 'Heidecker');
SELECT * FROM mechanics GROUP BY id ASC;
UPDATE mechanics SET f_name = 'Eric' WHERE id = 
(SELECT id FROM mechanics WHERE f_name = 'Tim' AND l_name = 'Heidecker');
SELECT * FROM mechanics GROUP BY id ASC;
DELETE FROM mechanics WHERE id = 
(SELECT id FROM mechanics WHERE f_name = 'Eric' AND l_name = 'Heidecker');
SELECT * FROM mechanics GROUP BY id ASC;


--------------------MANIPULATE WORK_ORDERS---------------------
SELECT * FROM work_orders;
--insert into MANY to MANY 
INSERT INTO work_orders(repair_order_id, work_task_id, mechanic_id, start_date) VALUE
((SELECT id FROM repair_orders WHERE car_id = 3),
(SELECT id FROM work_tasks WHERE name = 'Test Drive'),
(SELECT id FROM mechanics WHERE f_name = 'Bob' 
AND l_name = 'Painter'),'2020-05-22'
);
SELECT * FROM work_orders;
UPDATE work_orders SET end_date = '2020-05-23' WHERE id = 8;
SELECT * FROM work_orders;
--delete MANY to MANY 
DELETE FROM work_orders WHERE work_task_id = 5 AND repair_order_id = 3;
SELECT * FROM work_orders;
