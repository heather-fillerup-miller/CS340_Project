-- customers SPECIFIC EXAMPLE
SELECT * FROM customers WHERE (
id LIKE '%chris%' OR
f_name LIKE '%chris%' OR
l_name LIKE '%chris%' OR
contact_no LIKE '%chris%' OR
email_address LIKE '%chris%'
);


-- customers GENERIC
id LIKE '?' OR
f_name LIKE '?' OR
l_name LIKE '?' OR
contact_no LIKE '?' OR
email_address LIKE '?'
);


-- cars SPECIFIC EXAMPLE
-- NOTE: cannot wildcard year type?
SELECT * FROM cars WHERE (
id LIKE '%Honda%' OR
customer_id LIKE '%Honda%' OR
license_plate LIKE '%Honda%' OR
make LIKE '%Honda%' OR
model_name LIKE '%Honda%'
);

-- cars GENERIC
SELECT * FROM cars WHERE (
id LIKE '%3%' OR
customer_id LIKE '%3%' OR
license_plate LIKE '%3%' OR
make LIKE '%3%' OR
model_name LIKE '%3%'
);

-- cars GENERIC
-- NOTE: cannot wildcard year type?
SELECT * FROM cars WHERE (
id LIKE '%?%' OR
customer_id LIKE '%?%' OR
license_plate LIKE '%?%' OR
make LIKE '%?%' OR
model_name LIKE '%?%'
);

-- mechanics SPECIFIC EXAMPLE
SELECT * FROM mechanics WHERE (
id LIKE '%Jake%' OR
f_name LIKE '%Jake%' OR
l_name LIKE '%Jake%'
);


-- mechanics GENERIC
SELECT * FROM mechanics WHERE (
id LIKE '?'OR
f_name LIKE '?' OR
l_name LIKE '?'
);


-- repair_orders SPECIFIC EXAMPLE
SELECT * FROM repair_orders WHERE (
id LIKE '%3%' OR
car_id LIKE '%3%' OR
date_received LIKE '%3%' OR
date_completed LIKE '%3%'
);


-- repair_orders GENERIC
SELECT * FROM repair_orders WHERE (
id LIKE '%?%' OR
car_id LIKE '%?%' OR
date_received LIKE '%?%' OR
date_completed LIKE '%?%'
);


-- work_orders SPECIFIC EXAMPLE
SELECT * FROM work_orders WHERE (
id LIKE '%3%' OR
repair_order_id LIKE '%3%' OR
work_task_id LIKE '%3%' OR
mechanic_id LIKE '%3%' OR
start_date LIKE '%3%' OR
end_date LIKE '%3%'
);

-- work_orders GENERIC 
SELECT * FROM work_orders WHERE (
id LIKE '?' OR
repair_order_id LIKE '?' OR
work_task_id LIKE '?' OR
mechanic_id LIKE '?' OR
start_date LIKE '?' OR
end_date LIKE '?'
);

-- work_tasks SPECIFIC EXAMPLE
SELECT * FROM work_tasks WHERE (
id LIKE 'diagnosis' OR
name LIKE 'diagnosis' 
);
