SELECT CONCAT(customers.f_name, ' ', customers.l_name) AS customer_name,
CONCAT(cars.make, ' ', cars.model_name, ' ', cars.model_year) AS car_description,
work_tasks.name AS work_task, work_tasks.id AS work_task_id, work_orders.start_date
AS start_date, CONCAT(mechanics.f_name, ' ', mechanics.l_name) AS mechanic_name
FROM repair_orders JOIN cars ON repair_orders.car_id = cars.id
JOIN customers ON cars.customer_id = customers.id
JOIN work_orders ON repair_orders.id = work_orders.repair_order_id 
AND work_orders.end_date IS NULL
JOIN work_tasks ON work_orders.work_task_id = work_tasks.id
JOIN mechanics ON work_orders.mechanic_id = mechanics.id
GROUP BY work_orders.start_date DESC, customers.f_name, work_tasks.id;


