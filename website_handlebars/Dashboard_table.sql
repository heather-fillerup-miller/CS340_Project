SELECT customers.f_name AS first_name, customers.l_name AS last_name,
work_tasks.name AS work_task, work_orders.start_date
AS start_date, mechanics.f_name AS mechanic_f_name, mechanics.l_name AS mechanic_l_name
FROM repair_orders JOIN cars ON repair_orders.car_id = cars.id
JOIN customers ON cars.customer_id = customers.id
JOIN work_orders ON repair_orders.id = work_orders.repair_order_id
JOIN work_tasks ON work_orders.work_task_id = work_tasks.id
JOIN mechanics ON work_orders.mechanic_id = mechanics.id;
