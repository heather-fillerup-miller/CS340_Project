var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var mysql = require('./dbcon.js');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));

/**************************************************************
 * Dashboard- no functionality, just overview of current work tasks
 * ************************************************************/

app.get('/home', function(req, res, next) {
    var context = {};
    context.addHref = '/home';
    context.title = 'Dashboard';
    var sql = "SELECT CONCAT(customers.f_name, ' ', customers.l_name) AS customer_name, "
            + "CONCAT(cars.make, ' ', cars.model_name, ' ', cars.model_year) AS car_description, "
            + "work_tasks.name AS work_task, work_orders.start_date AS start_date, "
            + "CONCAT(mechanics.f_name, ' ', mechanics.l_name) AS mechanic_name "
            + "FROM repair_orders JOIN cars ON repair_orders.car_id = cars.id "
            + "JOIN customers ON cars.customer_id = customers.id "
            + "JOIN work_orders ON repair_orders.id = work_orders.repair_order_id AND work_orders.end_date IS NULL "
            + "JOIN work_tasks ON work_orders.work_task_id = work_tasks.id "
            + "JOIN mechanics ON work_orders.mechanic_id = mechanics.id "
            + "GROUP BY work_orders.start_date DESC, customers.f_name, work_tasks.id;";
    mysql.pool.query(sql, function(err, results){
        if(err){
            if(err.sqlMessage){
                context.errorMessage = err.sqlMessage;
                res.render('errors', context);
            }else {
                throw err;
            }
        }else {
            renderPage(results);
        }
    });
    function renderPage(results) {
        context.dataRows = results;
        res.render('home', context);
    }
});



/**************************************************************
 * Customers
 * ************************************************************/

//VIEW customers
app.get('/customers', function(req, res, next) {
    var context = {};
    var tableName = 'customers'; 
    context.addHref = '/addCustomer';
    context.deleteHref = '/deleteCustomer';
    //context.updateHref = '/updateCustomer';
    context.title = 'Customers';
    var sql = 'SELECT * FROM ?? ORDER BY ?? ASC; SELECT ?? FROM ?? WHERE ?? = ?';
    var inserts = [tableName, 'id', 'Column_name', 'Information_schema.columns', 'Table_name', tableName];
    mysql.pool.query(sql, inserts, function(err, results){
        if(err){
            if(err.sqlMessage){
                context.errorMessage = err.sqlMessage;
                res.render('errors', context);
            }else {
                throw err;
            }
        }else {
            renderPage(results);
        }
    });
    function renderPage(results) {
        context.dataRows = results[0];
        context.dataColumns = results[1];
        res.render('viewTable', context);
    }
});

//ADD FORM customers
app.get('/addCustomer', function(req, res, next) {
    var context = {};
    var tableName = 'customers';
    context.title = 'Customer';
    context.postHref= '/addCustomer';
    var sql = 'SELECT ??, ?? FROM ?? WHERE ?? = ?';
    var inserts = ['Column_name', 'Data_type', 'Information_schema.columns', 'Table_name', tableName];
    mysql.pool.query(sql, inserts, function(err, results){
        if(err){
            if(err.sqlMessage){
                context.errorMessage = err.sqlMessage;
                res.render('errors', context);
            }else {
                throw err;
            }
        }else {
            renderPage(results);
        }
    });
    function renderPage(results) {
        results.forEach(getInputType);
        function getInputType(item) {
            if(item.Column_name != 'id') {
                item.notId = 1;
            }
            if(item.Data_type == 'int') {
                item.Data_type = 'number';
                item.min = '0';
            }
            else if(item.Data_type == 'varchar') {
                item.Data_type = 'text';
            }
        }
        context.dataColumns = results;
        res.render('add', context);
    }
});

//INSERT customers
app.post('/addCustomer', function(req, res, next){
    context = {};
    context.title = 'Customer';
    context.addHref = '/addCustomer';
    context.viewHref= '/customers';
    var sql = 'INSERT INTO customers (f_name, l_name, contact_no, email_address) VALUES (?, ?, ?, ?)';
    var inserts = [req.body.f_name, req.body.l_name, req.body.contact_no, req.body.email_address];
    mysql.pool.query(sql, inserts,function(err, results){
        if(err){
            if(err.sqlMessage){
                context.errorMessage = err.sqlMessage;
                res.render('errors', context);
            }else {
                throw err;
            }
        }else {
            renderPage(results);
        }
        function renderPage(results) {
            context.idAdded = results.insertId;
            res.render('add',context);
        }
    });
});

//DELETE customers
app.get('/deleteCustomer', function(req, res, next){
    context = {};
    context.title = 'Customer';
    context.viewHref = '/customers';
    var deleteId = req.query.id;
    context.deleteId = deleteId;
    var sql = 'DELETE FROM customers WHERE id = ?';
    var inserts = [deleteId];
    mysql.pool.query(sql, inserts, function(err, results) {
        if(err){
            if(err.sqlMessage){
                context.errorMessage = err.sqlMessage;
                res.render('errors', context);
            }else {
                throw err;
            }
        }else {
            renderPage(results);
        }
        function renderPage(results) {
            context.affectedRows = results.affectedRows;
            res.render('delete', context);
        }
    });
});

/**************************************************************
 * Mechanics
 * ************************************************************/

//VIEW mechanics
app.get('/mechanics', function(req, res, next) {
    var context = {};
    var tableName = 'mechanics';
    context.addHref = '/addMechanic';
    context.deleteHref = '/deleteMechanic';
    context.title = 'Mechanics';
    var sql = 'SELECT * FROM ?? ORDER BY ?? ASC; SELECT ?? FROM ?? WHERE ?? = ?';
    var inserts = [tableName, 'id', 'Column_name', 'Information_schema.columns', 'Table_name', tableName];
    mysql.pool.query(sql, inserts, function(err, results){
        if(err){
            if(err.sqlMessage){
                context.errorMessage = err.sqlMessage;
                res.render('errors', context);
            }else {
                throw err;
            }
        }else {
            renderPage(results);
        }
    });
    function renderPage(results) {
        context.dataRows = results[0];
        context.dataColumns = results[1];
        res.render('viewTable', context);
    }
});

//ADD FORM mechanics
app.get('/addMechanic', function(req, res, next) {
    var context = {};
    var tableName = 'mechanics';
    context.title = 'Mechanic';
    context.postHref= '/addMechanic';
    var sql = 'SELECT ??, ?? FROM ?? WHERE ?? = ?';
    var inserts = ['Column_name', 'Data_type', 'Information_schema.columns', 'Table_name', tableName];
    mysql.pool.query(sql, inserts, function(err, results){
        if(err){
            if(err.sqlMessage){
                context.errorMessage = err.sqlMessage;
                res.render('errors', context);
            }else {
                throw err;
            }
        }else {
            renderPage(results);
        }
    });
    function renderPage(results) {
        results.forEach(getInputType);
        function getInputType(item) {
            if(item.Column_name != 'id') {
                item.notId = 1;
            }
            if(item.Data_type == 'int') {
                item.Data_type = 'number';
                item.min = '0';
            }
            else if(item.Data_type == 'varchar') {
                item.Data_type = 'text';
            }
        }
        context.dataColumns = results;
        res.render('add', context);
    }
});

//INSERT mechanics
app.post('/addMechanic', function(req, res, next){
    context = {};
    context.title = 'Mechanic';
    context.addHref = '/addMechanic';
    context.viewHref= '/mechanics';
    var sql = 'INSERT INTO mechanics (f_name, l_name) VALUES (?, ?)';
    var inserts = [req.body.f_name, req.body.l_name];
    mysql.pool.query(sql, inserts,function(err, results){
        if(err){
            if(err.sqlMessage){
                context.errorMessage = err.sqlMessage;
                res.render('errors', context);
            }else {
                throw err;
            }
        }else {
            renderPage(results);
        }
        function renderPage(results) {
            context.idAdded = results.insertId;
            res.render('add',context);
        }
    });
});

//DELETE mechanics
app.get('/deleteMechanic', function(req, res, next){
    context = {};
    context.title = 'Mechanic';
    context.viewHref = '/mechanics';
    var deleteId = req.query.id;
    context.deleteId = deleteId;
    var sql = 'DELETE FROM mechanics WHERE id = ?';
    var inserts = [deleteId];
    mysql.pool.query(sql, inserts, function(err, results) {
        if(err){
            if(err.sqlMessage){
                context.errorMessage = err.sqlMessage;
                res.render('errors', context);
            }else {
                throw err;
            }
        }else {
            renderPage(results);
        }
        function renderPage(results) {
            context.affectedRows = results.affectedRows;
            res.render('delete', context);
        }
    });
});

/**************************************************************
 * Work Tasks
 * ************************************************************/

 //VIEW work_tasks
 app.get('/workTasks', function(req, res, next) {
    var context = {};
    var tableName = 'work_tasks';
    context.addHref = '/addWorkTask';
    context.deleteHref = '/deleteWorkTask';
    context.title = 'Work Tasks';
    var sql = 'SELECT * FROM ??  ORDER BY ?? ASC; SELECT ?? FROM ?? WHERE ?? = ?';
    var inserts = [tableName, 'id', 'Column_name', 'Information_schema.columns', 'Table_name', tableName];
    mysql.pool.query(sql, inserts, function(err, results){
        if(err){
            if(err.sqlMessage){
                context.errorMessage = err.sqlMessage;
                res.render('errors', context);
            }else {
                throw err;
            }
        }else {
            renderPage(results);
        }
    });
    function renderPage(results) {
        context.dataRows = results[0];
        context.dataColumns = results[1];
        res.render('viewTable', context);
    }
});

//ADD FORM work_tasks
app.get('/addWorkTask', function(req, res, next) {
    var context = {};
    var tableName = 'work_tasks';
    context.title = 'Work Task';
    context.postHref = '/addWorkTask';
    var sql = 'SELECT ??, ?? FROM ?? WHERE ?? = ?';
    var inserts = ['Column_name', 'Data_type', 'Information_schema.columns', 'Table_name', tableName];
    mysql.pool.query(sql, inserts, function(err, results){
        if(err){
            if(err.sqlMessage){
                context.errorMessage = err.sqlMessage;
                res.render('errors', context);
            }else {
                throw err;
            }
        }else {
            renderPage(results);
        }
    });
    function renderPage(results) {
        results.forEach(getInputType);
        function getInputType(item) {
            if(item.Column_name != 'id') {
                item.notId = 1;
            }
            if(item.Data_type == 'int') {
                item.Data_type = 'number';
                item.min = '0';
            }
            else if(item.Data_type == 'varchar') {
                item.Data_type = 'text';
            }
        }
        context.dataColumns = results;
        res.render('add', context);
    }
});

//INSERT work_tasks
app.post('/addWorkTask', function(req, res, next){
    context = {};
    context.title = 'Work Task';
    context.addHref = '/addWorkTask';
    context.viewHref= '/workTasks';
    var sql = 'INSERT INTO work_tasks (name) VALUES (?)';
    var inserts = [req.body.name];
    mysql.pool.query(sql, inserts,function(err, results){
        if(err){
            if(err.sqlMessage){
                context.errorMessage = err.sqlMessage;
                res.render('errors', context);
            }else {
                throw err;
            }
        }else {
            renderPage(results);
        }
        function renderPage(results) {
            context.idAdded = results.insertId;
            res.render('add',context);
        }
    });
});

//DELETE work_tasks
app.get('/deleteWorkTask', function(req, res, next){
    context = {};
    context.title = 'Work Task';
    context.viewHref = '/workTasks';
    var deleteId = req.query.id;
    context.deleteId = deleteId;
    var sql = 'DELETE FROM work_tasks WHERE id = ?';
    var inserts = [deleteId];
    mysql.pool.query(sql, inserts, function(err, results) {
        if(err){
            if(err.sqlMessage){
                context.errorMessage = err.sqlMessage;
                res.render('errors', context);
            }else {
                throw err;
            }
        }else {
            renderPage(results);
        }
        function renderPage(results) {
            context.affectedRows = results.affectedRows;
            res.render('delete', context);
        }
    });
});

/**************************************************************
 * Cars
 * ************************************************************/

//View cars
app.get('/cars', function(req, res, next) {
    var context = {};
    var tableName = 'cars';
    context.addHref = '/addCar';
    context.deleteHref = '/deleteCar';
    context.title = 'Cars';
    //first query for table records
    var sql = 'SELECT cars.id, CONCAT(customer_id, " { ", f_name, " ", l_name, " }") as customer_name, '
        + 'license_plate, make, model_year, model_name '
        + 'FROM cars LEFT JOIN customers ON customer_id = customers.id  ORDER BY cars.id ASC; ';
    //second query for table column names
    sql += 'SELECT ?? FROM ?? WHERE ?? = ?';
    var inserts = ['Column_name', 'Information_schema.columns', 'Table_name', tableName];
    mysql.pool.query(sql, inserts, function(err, results){
        if(err){
            if(err.sqlMessage){
                context.errorMessage = err.sqlMessage;
                res.render('errors', context);
            }else {
                throw err;
            }
        }else {
            renderPage(results);
        }
    });
    function renderPage(results) {
        context.dataRows = results[0];
        context.dataColumns = results[1];
        res.render('viewTable', context);
    }
});

//ADD cars
app.get('/addCar', function(req, res, next) {
    var context = {};
    var tableName = 'cars';
    context.postHref = '\addCar';
    context.title = 'Car';
    var sql = 'SELECT ??, ?? FROM ?? WHERE ?? = ?';
    var inserts = ['Column_name', 'Data_type', 'Information_schema.columns', 'Table_name', tableName];
    mysql.pool.query(sql, inserts, function(err, results){
        if(err){
            if(err.sqlMessage){
                context.errorMessage = err.sqlMessage;
                res.render('errors', context);
            }else {
                throw err;
            }
        }else {
            renderPage(results);
        }
    });
    function renderPage(results) {
        results.forEach(getInputType);
        function getInputType(item) {
            if(item.Column_name != 'id') {
                item.notId = 1;
            }
            if(item.Data_type == 'int') {
                item.Data_type = 'number';
                item.min = '0';
            }
            else if(item.Data_type == 'varchar') {
                item.Data_type = 'text';
            }
        }
        context.dataColumns = results;
        res.render('add', context);
    }
});

//INSERT Cars
app.post('/addCar', function(req, res, next){
    context = {};
    context.title = 'Car';
    context.addHref = '/addCar';
    context.viewHref= '/cars';
    var sql = 'INSERT INTO cars (??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?)';
    var inserts = ['customer_id', 'license_plate', 'make', 'model_name', 'model_year'];
    inserts.push(req.body.customer_id, req.body.license_plate, req.body.make, req.body.model_name, req.body.model_year);
    mysql.pool.query(sql, inserts,function(err, results){
        if(err){
            if(err.sqlMessage){
                context.errorMessage = err.sqlMessage;
                res.render('errors', context);
            }else {
                throw err;
            }
        }else {
            renderPage(results);
        }
        function renderPage(results) {
            context.idAdded = results.insertId;
            res.render('add',context);
        }
    });
});

//DELETE cars
app.get('/deleteCar', function(req, res, next){
    context = {};
    context.title = 'Car';
    context.viewHref = '/cars';
    var deleteId = req.query.id;
    context.deleteId = deleteId;
    var sql = 'DELETE FROM cars WHERE id = ?';
    var inserts = [deleteId];
    mysql.pool.query(sql, inserts, function(err, results) {
        if(err){
            if(err.sqlMessage){
                context.errorMessage = err.sqlMessage;
                res.render('errors', context);
            }else {
                throw err;
            }
        }else {
            renderPage(results);
        }
        function renderPage(results) {
            context.affectedRows = results.affectedRows;
            res.render('delete', context);
        }
    });
});

/**************************************************************
 * Repair Orders
 * ************************************************************/

//VIEW repair_orders
app.get('/repairOrders', function(req, res, next) {
    var context = {};
    var tableName = 'repair_orders';
    context.addHref = '/addRepairOrder'
    context.deleteHref = '/deleteRepairOrder'
    context.title = 'Repair Orders';
    //first query for table records
    var sql = 'SELECT repair_orders.id, '
        + 'CONCAT(car_id, " { ", model_year, " ", make, " ", model_name, " } ") as car_description, '
        + 'date_received, date_completed '
        + 'FROM repair_orders LEFT JOIN cars ON car_id = cars.id  '
        + 'ORDER BY repair_orders.id ASC; ';
    //second quert for table column names
    sql += 'SELECT ?? FROM ?? WHERE ?? = ?';
    var inserts =['Column_name', 'Information_schema.columns', 'Table_name', tableName];
    mysql.pool.query(sql, inserts, function(err, results){
        if(err){
            if(err.sqlMessage){
                context.errorMessage = err.sqlMessage;
                res.render('errors', context);
            }else {
                throw err;
            }
        }else {
            renderPage(results);
        }
    });
    function renderPage(results) {
        context.dataRows = results[0];
        context.dataColumns = results[1];
        res.render('viewTable', context);
    }
});

//ADD FORM repair_orders
app.get('/addRepairOrder', function(req, res, next) {
    var context = {};
    var tableName = 'repair_orders';
    context.title = 'Repair Order';
    context.postHref = '/addRepairOrder'
    var sql = 'SELECT ??, ?? FROM ?? WHERE ?? = ?';
    var inserts = ['Column_name', 'Data_type', 'Information_schema.columns', 'Table_name', tableName];
    mysql.pool.query(sql, inserts, function(err, results){
        if(err){
            if(err.sqlMessage){
                context.errorMessage = err.sqlMessage;
                res.render('errors', context);
            }else {
                throw err;
            }
        }else {
            renderPage(results);
        }
    });
    function renderPage(results) {
        results.forEach(getInputType);
        function getInputType(item) {
            if(item.Column_name != 'id') {
                item.notId = 1;
            }
            if(item.Data_type == 'int') {
                item.Data_type = 'number';
                item.min = '0';
            }
            else if(item.Data_type == 'varchar') {
                item.Data_type = 'text';
            }
        }
        context.dataColumns = results;
        res.render('add', context);
    }
});

//INSERT repair_orders
app.post('/addRepairOrder', function(req, res, next){
    context = {};
    context.title = 'Repair Order';
    context.addHref = '/addRepairOrder';
    context.viewHref= '/repairOrders';
    var sql = 'INSERT INTO repair_orders (car_id, date_received, date_completed) VALUES (?, ?, ?)';
    var inserts = [req.body.car_id, req.body.date_received, req.body.date_completed];
    mysql.pool.query(sql, inserts,function(err, results){
        if(err){
            if(err.sqlMessage){
                context.errorMessage = err.sqlMessage;
                res.render('errors', context);
            }else {
                throw err;
            }
        }else {
            renderPage(results);
        }
        function renderPage(results) {
            context.idAdded = results.insertId;
            res.render('add',context);
        }
    });
});

//DELETE repair_orders
app.get('/deleteRepairOrder', function(req, res, next){
    context = {};
    context.title = 'Repair Order';
    context.viewHref = '/repairOrders';
    var deleteId = req.query.id;
    context.deleteId = deleteId;
    var sql = 'DELETE FROM repair_orders WHERE id = ?';
    var inserts = [deleteId];
    mysql.pool.query(sql, inserts, function(err, results) {
        if(err){
            if(err.sqlMessage){
                context.errorMessage = err.sqlMessage;
                res.render('errors', context);
            }else {
                throw err;
            }
        }else {
            renderPage(results);
        }
        function renderPage(results) {
            context.affectedRows = results.affectedRows;
            res.render('delete', context);
        }
    });
});

/**************************************************************
 * Work Orders
 * ************************************************************/

//VIEW work_orders
app.get('/workOrders', function(req, res, next) {
    var context = {};
    var tableName = 'work_orders';
    context.addHref = '/addWorkOrder';
    context.deleteHref = '/deleteWorkOrder'
    context.title = 'Work Orders';
    //work_order records
    var sql = 'SELECT work_orders.id, '
        + 'CONCAT(repair_order_id, " {", model_year, " ", make, " ", model_name, "} ") AS repair, '
        + 'CONCAT(work_task_id, " {", name, "} ") AS task, '
        + 'CONCAT(mechanic_id, " {", f_name, " ", l_name, "} ") AS mechanic, '
        + 'start_date, end_date '
        + 'FROM work_orders '
        + 'LEFT JOIN repair_orders ON repair_order_id = repair_orders.id '
        + 'LEFT JOIN cars ON repair_orders.car_id = cars.id '
        + 'LEFT JOIN work_tasks ON work_task_id = work_tasks.id '
        + 'LEFT JOIN mechanics ON mechanic_id = mechanics.id '
        + 'ORDER BY work_orders.id ASC;';
    //column_names
    sql += 'SELECT ?? FROM ?? WHERE ?? = ?;';
    var inserts = ['Column_name', 'Information_schema.columns', 'Table_name', tableName];
    mysql.pool.query(sql, inserts, function(err, results){
        if(err){
            if(err.sqlMessage){
                context.errorMessage = err.sqlMessage;
                res.render('errors', context);
            }else {
                throw err;
            }
        }else {
            renderPage(results);
        }
        function renderPage(results) {
            context.dataRows = results[0];
            context.dataColumns = results[1];
            res.render('viewTable', context);
        }
    });
});

//ADD FORM work_orders
app.get('/addWorkOrder', function(req, res, next) {
    var context = {};
    var tableName = 'work_orders';
    context.title = 'Work Order';
    context.postHref = "/addWorkOrder";
    var sql = 'SELECT ??, ?? FROM ?? WHERE ?? = ?';
    var inserts = ['Column_name', 'Data_type', 'Information_schema.columns', 'Table_name', tableName];
    mysql.pool.query(sql, inserts, function(err, results){
        if(err){
            if(err.sqlMessage){
                context.errorMessage = err.sqlMessage;
                res.render('errors', context);
            }else {
                throw err;
            }
        }else {
            renderPage(results);
        }
    });
    function renderPage(results) {
        results.forEach(getInputType);
        function getInputType(item) {
            if(item.Column_name != 'id') {
                item.notId = 1;
            }
            if(item.Data_type == 'int') {
                item.Data_type = 'number';
                item.min = '0';
            }
            else if(item.Data_type == 'varchar') {
                item.Data_type = 'text';
            }
         }
        context.dataColumns = results;
        res.render('add', context);
    }
});

//INSERT work_orders
app.post('/addWorkOrder', function(req, res, next){
    context = {};
    context.title = 'Work Order';
    context.addHref = '/addWorkOrder';
    context.viewHref= '/workOrders';
    var sql = 'INSERT INTO work_orders (repair_order_id, work_task_id, mechanic_id, start_date, end_date) VALUES (?, ?, ?, ?, ?)';
    var inserts = [req.body.repair_order_id, req.body.work_task_id, req.body.mechanic_id, req.body.start_date, req.body.end_date];
    mysql.pool.query(sql, inserts,function(err, results){
        if(err){
            if(err.sqlMessage){
                context.errorMessage = err.sqlMessage;
                res.render('errors', context);
            }else {
                throw err;
            }
        }else {
            renderPage(results);
        }
        function renderPage(results) {
            context.idAdded = results.insertId;
            res.render('add',context);
        }
    });
});

//DELETE work_orders
app.get('/deleteWorkOrder', function(req, res, next){
    context = {};
    context.title = 'Work Order';
    context.viewHref = '/workOrders';
    var deleteId = req.query.id;
    context.deleteId = deleteId;
    var sql = 'DELETE FROM work_orders WHERE id = ?';
    var inserts = [deleteId];
    mysql.pool.query(sql, inserts, function(err, results) {
        if(err){
            if(err.sqlMessage){
                context.errorMessage = err.sqlMessage;
                res.render('errors', context);
            }else {
                throw err;
            }
        }else {
            renderPage(results);
        }
        function renderPage(results) {
            context.affectedRows = results.affectedRows;
            res.render('delete', context);
        }
    });
});

/**************************************************************
 * Error Handling
 * ************************************************************/
app.use(function(req, res) {
    var context = {};
    context.status = '404 - Not Found';
    res.status(404);
    res.render('errors', context);
});

app.use(function(err, req, res, next) {
    var context = {};
    context.status = '500 - Server Error';
    console.log(err.stack);
    res.status(500);
    res.render('errors', context);
})

/**************************************************************
 * Port
 * ************************************************************/
app.listen(app.get('port'), function() {
    console.log('Express started on port: ' + app.get('port') + '; press Ctrl-C to terminate');
});