--------------------------------------------------------------------------------------
-- Below is the special character data manipulation 
-- queries.  Included at the end of this document
-- are the actual sql commands for the manipulation
-- if you would like to try it out on mariaDB.
--------------------------------------------------------------------------------------


--many to many 
--space to make look nice
-----------------------MANIPULATE CUSTOMERS------------------------
--select all rows from customers
SELECT * FROM customers;

--insert into customers
INSERT INTO customers(f_name, l_name, contact_no, email_address) VALUES 
(::f_name_input, :l_name_input, ::contact_no_input, ::email_address)input);

--update customers table
UPDATE customers SET l_name = ::l_name_input WHERE id = ::id_input;  

--delete from customers table
DELETE FROM customers WHERE id = ::id_input;


-----------------------MANIPULATE CARS------------------------
--select all rows from cars
SELECT * FROM cars;

--1 to MANY NULLABLE customer_id
INSERT INTO cars(customer_id, license_plate, make, model_name, model_year) VALUES 
((SELECT id FROM customers WHERE id = ::id_input), ::licence_plate_input,
::make_input, ::model_name_input, ::model_year_input);

--update cars table
UPDATE cars SET make = ::make_input WHERE 
id = (SELECT id FROM cars WHERE license_plate = ::license_plate_input);

--delete from cars table
DELETE FROM cars WHERE id = ::id_input;


--------------------MANIPULATE REPAIR_ORDERS---------------------
--select all rows from repair_orders
SELECT * FROM repair_orders;

--insert into repair_orders table
INSERT INTO repair_orders(car_id, date_received) VALUES
((SELECT id FROM cars WHERE license_plate = ::license_plate_input), ::date_input);

--update repair_orders table
UPDATE repair_orders SET date_received = ::date_received_input WHERE car_id =
(SELECT car_id FROM cars WHERE cars.license_plate = ::license_plate_id);

--delete from repair_orders
DELETE FROM repair_orders WHERE car.license_plate = (SELECT car_id FROM cars WHERE 
cars.license_plate = ::license_plate_id);


--------------------MANIPULATE WORK_TASKS---------------------
--select all rows from work_tasks
SELECT * FROM work_tasks;

--insert into work_tasks
INSERT INTO work_tasks(name) VALUES (::name_input);

--update work_tasks table
UPDATE work_tasks SET name = ::name_input  WHERE id = (
SELECT id from work_tasks WHERE name = ::name_input);

--delete from work_tasks
DELETE FROM work_tasks WHERE id = (SELECT id from work_tasks WHERE name = ::name_input);


--------------------MANIPULATE MECHANICS---------------------
--select all rows from mechanics
SELECT * FROM mechanics GROUP BY id ASC;

--insert into mechanics
INSERT INTO mechanics(f_name, l_name) VALUES (::f_name_input, ::l_name_input);

--update mechanics tables
UPDATE mechanics SET f_name = ::f_name_input WHERE id = 
(SELECT id FROM mechanics WHERE f_name = ::f_name_input AND l_name = ::l_name_input);

--delete from mechanics table
DELETE FROM mechanics WHERE id = 
(SELECT id FROM mechanics WHERE f_name = ::f_name_input AND l_name = ::l_name_input);


--------------------MANIPULATE WORK_ORDERS---------------------
--select all row from MANY to MANY table
SELECT * FROM work_orders;

--insert into MANY to MANY 
INSERT INTO work_orders(repair_order_id, work_task_id, mechanic_id, start_date) VALUE
((SELECT id FROM repair_orders WHERE car_id = ::id_input),
(SELECT id FROM work_tasks WHERE name = ::name_input),
(SELECT id FROM mechanics WHERE f_name = ::f_name_input  
AND l_name = ::l_name_input), ::start_date_input
);

--update a row in our MANY to MANY
UPDATE work_orders SET end_date = ::start_date_input WHERE id = ::id_input;

--delete MANY to MANY 
DELETE FROM work_orders WHERE work_task_id = ::work_taks_id_input  
AND repair_order_id = ::repair_order_id_input;



--------------------------------------------------------------------------------------
-- Below are the actual queries with no special characters, 
-- copy / paste these blocks in mariaDB to see them in action
--------------------------------------------------------------------------------------



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
INSERT INTO work_orders(repair_order_id, work_task_id, mechanic_id, start_date) VALUE
((SELECT id FROM repair_orders WHERE car_id = 3),
(SELECT id FROM work_tasks WHERE name = 'Test Drive'),
(SELECT id FROM mechanics WHERE f_name = 'Bob' 
AND l_name = 'Painter'),'2020-05-22'
);
SELECT * FROM work_orders;
UPDATE work_orders SET end_date = '2020-05-23' WHERE id = 8;
SELECT * FROM work_orders;
DELETE FROM work_orders WHERE work_task_id = 5 AND repair_order_id = 3;
SELECT * FROM work_orders;
