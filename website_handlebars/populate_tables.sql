-- INSERT customers --
INSERT INTO customers(f_name, l_name, contact_no, email_address) VALUES ('chris', 'nelson', '555-394-0383', 
'silly@goofy.com'), ('heather', 'fillerup', '808-234-5467', 
'genius@smart.com'), ('simon', 'garfunky', '098-938-9383', '^^ ignore this ^^ @spaceisfake.com');
-- INSERT customers --

-- test insert into cars --
INSERT INTO cars(customer_id, license_plate, make, model_name,
model_year) VALUES 
((SELECT id FROM customers WHERE f_name = 'chris' AND l_name = 'nelson'), 
'tbh-0012', 'Ferrari', '488', '2019'),
((SELECT id FROM customers WHERE f_name = 'chris' AND l_name = 'nelson'), 
'bgi-4589', 'Honda', 'Civic', '2006'),
((SELECT id FROM customers WHERE f_name = 'heather' AND l_name = 'fillerup'), 
'bad-1234', 'Fiat', '500', '2014');
-- test insert into cars --

-- test insert into repair_orders --
INSERT INTO repair_orders(car_id, date_received) VALUES
((SELECT id FROM cars WHERE license_plate = 'bgi-4589'), '2020-05-02'),
((SELECT id FROM cars WHERE license_plate = 'tbh-0012'), '2020-05-05');
-- test insert into repair_orders --

-- test insert into work_tasks --
INSERT INTO work_tasks(name) VALUES 
('Diagnosis'), ('Customer Approval'), ('Order Parts'), ('Repair'), ('Test Drive'), ('Contact Customer');
-- test insert into work_tasks --

-- test insert int mechanics --
INSERT INTO mechanics(f_name, l_name) VALUES ('Jake', 'TheSnake'), ('bob', 'painter');
-- test insert int mechanics --

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
