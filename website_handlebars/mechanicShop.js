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
//app.use(express.static('images'))
app.use('/images', express.static('images'))
/**************************************************************
 * Handlebars Helper Functions
 * ************************************************************/

//check if value is NULL and return null or return date
 handlebars.handlebars.registerHelper("checkNull", function(value) {
    if(typeof(value) == 'object'){
        if(value == null){
            return "NULL";
        }
        new_date = value.toISOString().substring(0, 10);
        return new_date;
    }
    return value;
});

//Select option from dropdown list: reference: https://gist.github.com/LukeChannings/6173ab951d8b1dc4602e THANK YOU neeraj87!
handlebars.handlebars.registerHelper("selectOption", function (selected, option){
    if(selected == undefined) {
        return '';
    }
    return selected.indexOf(option) !== -1 ? 'selected' : '';
});

//replaces any empty strings with null
function makeNull(obj){
    Object.keys(obj).forEach((key,index) => {
        if(obj[key] == ""){
            obj[key] = null;
        }
    });
    return obj;
}

//checks for any null values and returns a status of true and name of property containing null value
function endUpdate(obj){
    var end = {};
    Object.keys(obj).forEach((key,index) => {
        if(obj[key] == null){
            end.status = 1;
            end.nullName = key;
            return end;
        }
    });
    return end;
}

/**************************************************************
 * Dashboard- no functionality, just overview of current work tasks
 * ************************************************************/

app.get('/home', function(req, res, next) {
    var context = {};
    context.addHref = '/home';
    context.title = 'Mahinui Auto Shop';
    var sql = "SELECT CONCAT(customers.f_name, ' ', customers.l_name) AS customer_name, "
            + "CONCAT(cars.model_year, ' ', cars.make, ' ', cars.model_name ) AS car_description, "
            + "work_tasks.name AS current_task, work_orders.start_date AS start_date, "
            + "CONCAT(mechanics.f_name, ' ', mechanics.l_name) AS mechanic_name "
            + "FROM repair_orders "
            + "LEFT JOIN cars ON repair_orders.car_id = cars.id "
            + "LEFT JOIN customers ON cars.customer_id = customers.id "
            + "LEFT JOIN work_orders ON repair_orders.id = work_orders.repair_order_id AND work_orders.end_date IS NULL "
            + "LEFT JOIN work_tasks ON work_orders.work_task_id = work_tasks.id "
            + "LEFT JOIN mechanics ON work_orders.mechanic_id = mechanics.id "
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
    context.searchHref = '/searchCustomers';
    context.updateHref = 'updateCustomer';
    context.title = 'Customers';
    context.update = '1'; //adds update button to view 
    context.custimg = '1';//jumbotron image
    context.relationship = '1:M OPTIONAL relationship with cars'
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
    context.viewHref = '/customers';
    context.update = '1';
    var newRecord = makeNull(req.body); //check for possible null values
    var sql = 'INSERT INTO customers (f_name, l_name, contact_no, email_address) VALUES (?, ?, ?, ?)';
    var inserts = [newRecord.f_name, newRecord.l_name, newRecord.contact_no, newRecord.email_address];
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

//UPDATE FORM customers
app.get('/updateCustomer', function(req, res, next){
    context = {};
    var tableName = 'customers';
    context.title = 'Customer';
    context.postHref = '/updateCustomer';
    context.viewHref = '/customers';
    //results[0] to get column names
    var sql = 'SELECT ??, ?? FROM ?? WHERE ?? = ?; ';
    var inserts = ['Column_name', 'Data_type', 'Information_schema.columns', 'Table_name', tableName];
   //results[1] to get current data in record
    sql += 'SELECT id, f_name, l_name, contact_no, email_address FROM customers WHERE id = ?';
    inserts.push(req.query.id);
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
        //format input and values for each column
        results[0].forEach(getInputType);
        function getInputType(item) {
            //add current record values to columns
            results[1].forEach(getValue);
            function getValue(record){
                if(item.Column_name =='id'){
                    item.value = record.id;
                }
                else if(item.Column_name == 'f_name'){
                    item.value = record.f_name;
                }
                else if(item.Column_name == 'l_name'){
                    item.value = record.l_name;
                }
                else if(item.Column_name == 'contact_no'){
                    item.value = record.contact_no;
                }
                else if(item.Column_name == 'email_address'){
                    item.value = record.email_address;
                }
            }
            //add input types to columns
            if(item.Column_name != 'id') {
                item.notId = 1;
            }
            if(item.Data_type == 'int' && item.Column_name != 'id') {
                item.Data_type = 'number';
                item.min = '0';
            }
            else if(item.Data_type == 'varchar') {
                item.Data_type = 'text';
            }
        }
        context.dataColumns = results[0];
        res.render('update', context);
    }
});

//UPDATE customer
app.post('/updateCustomer', function(req, res, next){
    var context = {};
    context.title = "Customer";
    context.viewHref = '/customers';
    var idUpdated = req.body.id;
    context.idUpdated = idUpdated;
    var updateRecord = makeNull(req.body); //check for possible null values
    var cancel = endUpdate(updateRecord);
    if(cancel.status){
        context.containsNull = 1;
        context.nullName = cancel.nullName;
        res.render('update', context);
    }else{
        var sql = 'UPDATE customers SET f_name = ?, l_name = ?, contact_no = ?, email_address = ? WHERE id = ?'; 
        var inserts = [updateRecord.f_name, updateRecord.l_name, updateRecord.contact_no, updateRecord.email_address, idUpdated];
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
                //console.log(results);
                context.changedRows = results.changedRows;
                res.render('update', context);
            }
        });
    }
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


//SEARCH customers
app.get('/searchCustomers', function(req, res, next) {
    var context = {};

    //set up the search substring
    var data = "%";
    data += req.query.search;
    data += "%";
    
    context.backHref = '/customers';
    context.title = 'Customers - filtered';
    var sql = 'SELECT * FROM customers WHERE (id LIKE ? OR f_name LIKE ? OR l_name LIKE ? OR contact_no LIKE ? OR email_address LIKE ?);';
    var inserts = [data,data,data,data,data];
    sql += 'SELECT ?? FROM ?? WHERE ?? = ?';
    inserts.push('Column_name', 'Information_schema.columns', 'Table_name', 'customers');
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
        res.render('searchTable', context);
    }
});

/**************************************************************
 * Mechanics
 * ************************************************************/

//VIEW mechanics
app.get('/mechanics', function(req, res, next) {
    var context = {};
    context.relationship = 'M:M relationship with repair_orders via composite entity work_orders'
    var tableName = 'mechanics';
    context.addHref = '/addMechanic';
    context.deleteHref = '/deleteMechanic';
    context.searchHref = '/searchMechanics';
    context.mechimg = '1'; //jumbotron image
    context.updateHref = 'updateMechanic';
    context.update = '1';
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
    var newRecord = makeNull(req.body); //check for possible null values
    var sql = 'INSERT INTO mechanics (f_name, l_name) VALUES (?, ?)';
    var inserts = [newRecord.f_name, newRecord.l_name];
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


//UPDATE FORM mechanics
app.get('/updateMechanic', function(req, res, next){
    context = {};
    var tableName = 'mechanics';
    context.title = 'Mechanics';
    context.postHref = '/updateMechanic';
    context.viewHref = '/mechanics';
    //results[0] to get column names
    var sql = 'SELECT ??, ?? FROM ?? WHERE ?? = ?; ';
    var inserts = ['Column_name', 'Data_type', 'Information_schema.columns', 'Table_name', tableName];
   //results[1] to get current data in record
    sql += 'SELECT id, f_name, l_name FROM mechanics WHERE id = ?';
    inserts.push(req.query.id);
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
        //format input and values for each column
        results[0].forEach(getInputType);
        function getInputType(item) {
            //add current record values to columns
            results[1].forEach(getValue);
            function getValue(record){
                if(item.Column_name =='id'){
                    item.value = record.id;
                }
                else if(item.Column_name == 'f_name'){
                    item.value = record.f_name;
                }
                else if(item.Column_name == 'l_name'){
                    item.value = record.l_name;
                }
            }
            //add input types to columns
            if(item.Column_name != 'id') {
                item.notId = 1;
            }
            if(item.Data_type == 'int' && item.Column_name != 'id') {
                item.Data_type = 'number';
                item.min = '0';
            }
            else if(item.Data_type == 'varchar') {
                item.Data_type = 'text';
            }
        }
        context.dataColumns = results[0];
        res.render('update', context);
    }
});

//UPDATE Mechanics
app.post('/updateMechanic', function(req, res, next){
    var context = {};
    context.title = "Mechanics";
    context.viewHref = '/mechanics';
    var idUpdated = req.body.id;
    context.idUpdated = idUpdated;
    var updateRecord = makeNull(req.body); //check for possible null values
    var cancel = endUpdate(updateRecord);
    if(cancel.status){
        context.containsNull = 1;
        context.nullName = cancel.nullName;
        res.render('update', context);
    }else{
        var sql = 'UPDATE mechanics SET f_name = ?, l_name = ? WHERE id = ?'; 
        var inserts = [updateRecord.f_name, updateRecord.l_name, idUpdated];
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
                //console.log(results);
                context.changedRows = results.changedRows;
                res.render('update', context);
            }
        });
    }
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

//SEARCH mechanics
app.get('/searchMechanics', function(req, res, next) {
    var context = {};

    //set up the search substring
    var data = "%";
    data += req.query.search;
    data += "%";
    context.backHref = '/mechanics';
    context.title = 'Mechanics - filtered';
    var sql = 'SELECT * FROM mechanics WHERE (id LIKE ? OR f_name LIKE ? OR l_name LIKE ?);';
    var inserts = [data,data,data];
    sql += 'SELECT ?? FROM ?? WHERE ?? = ?';
    inserts.push('Column_name', 'Information_schema.columns', 'Table_name', 'mechanics');
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
        res.render('searchTable', context);
    }
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
    context.taskimg = '1'; //jumbotron image
    context.searchHref = '/searchWorkTasks';
    context.relationship = 'M:M relationship with repair_orders via composite entity work_orders'
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
    var newRecord = makeNull(req.body);
    var sql = 'INSERT INTO work_tasks (name) VALUES (?)';
    var inserts = [newRecord.name];
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

//SEARCH work_tasks
app.get('/searchWorkTasks', function(req, res, next) {
    var context = {};

    //set up the search substring
    var data = "%";
    data += req.query.search;
    data += "%";
    context.backHref = '/workTasks';
    context.title = 'Work Tasks - filtered';
    var sql = 'SELECT * FROM work_tasks WHERE (id LIKE ? OR name LIKE ?);';
    var inserts = [data,data];
    sql += 'SELECT ?? FROM ?? WHERE ?? = ?';
    inserts.push('Column_name', 'Information_schema.columns', 'Table_name', 'work_tasks');
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
        res.render('searchTable', context);
    }
});

/**************************************************************
 * Cars
 * ************************************************************/

//View cars
app.get('/cars', function(req, res, next) {
    var context = {};
    context.relationship = '1:M OPTIONAL relationship with customers; 1:M relationship with repair_orders';
    var tableName = 'cars';
    context.addHref = '/addCar';
    context.deleteHref = '/deleteCar';
    context.searchHref = '/searchCars';
    context.updateHref = 'updateCar';
    context.carimg = '1'; //jumbotron image
    context.update = '1'; //adds update button to view
    context.title = 'Cars';
    //first query for table records
    var sql = 'SELECT cars.id, CONCAT(customer_id, " { ", f_name, " ", l_name, " }") as customer_name, '
        + 'license_plate, model_year, make, model_name '
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
    //results [0] to get column names
    var sql = 'SELECT ??, ?? FROM ?? WHERE ?? = ?; ';
    var inserts = ['Column_name', 'Data_type', 'Information_schema.columns', 'Table_name', tableName];
    //results [1] to get customers
    sql += 'SELECT customers.id AS fk_id, CONCAT(f_name, " ", l_name) AS fk_name FROM customers ORDER BY customers.id ASC';
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
        results[0].forEach(getInputType);
        function getInputType(item) {
            if(item.Column_name != 'id') {
                item.notId = 1;
            }
            if(item.Column_name == 'customer_id'){
                item.isForeignKey1 = 1;
            }
            if(item.Data_type == 'int') {
                item.Data_type = 'number';
                item.min = '0';
            }
            else if(item.Data_type == 'varchar') {
                item.Data_type = 'text';
            }
        }
        context.dataColumns = results[0];
        //add NULLABLE foreign key for customer_id
        results[1].unshift({fk_id: 0, fk_name: 'NULL'});
        context.fk1 = results[1];
        res.render('add', context);
    }
});

//INSERT Cars
app.post('/addCar', function(req, res, next){
    context = {};
    context.title = 'Car';
    context.addHref = '/addCar';
    context.viewHref= '/cars';
    var newRecord = makeNull(req.body); //check for possible null values
    var sql = 'INSERT INTO cars (??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?)';
    var inserts = ['customer_id', 'license_plate', 'make', 'model_name', 'model_year'];
    //manage when no customer is entered
    if (newRecord.customer_id == 0){
        inserts.push('NULL');
    } else {
        inserts.push(newRecord.customer_id);
    }
    inserts.push(newRecord.license_plate, newRecord.make, newRecord.model_name, newRecord.model_year);
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



//UPDATE from cars
app.get('/updateCar', function(req, res, next){
    context = {};
    var tableName = 'cars';
    context.title = 'Car';
    context.postHref = '/updateCar';
    context.viewHref = '/cars';
    //results[0] to get column names
    var sql = 'SELECT ??, ?? FROM ?? WHERE ?? = ?; ';
    var inserts = ['Column_name', 'Data_type', 'Information_schema.columns', 'Table_name', tableName];
   //results[1] to get current data in record
    sql += 'SELECT id, customer_id, license_plate, model_year, make, model_name FROM cars WHERE id = ?';
    inserts.push(req.query.id);
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
        //format input and values for each column
        results[0].forEach(getInputType);
        function getInputType(item) {
            //add current record values to columns
            results[1].forEach(getValue);
            function getValue(record){
                if(item.Column_name =='id'){
                    item.value = record.id;
                }
                else if(item.Column_name == 'customer_id'){
                    item.value = record.customer_id;
                }
                else if(item.Column_name == 'license_plate'){
                    item.value = record.license_plate;
                }
                else if(item.Column_name == 'model_year'){
                    item.value = record.model_year;
                }
                else if(item.Column_name == 'make'){
                    item.value = record.make;
                }
                else if(item.Column_name == 'model_name'){
                    item.value = record.model_name;
                }
            }
            //add input types to columns
            if(item.Column_name != 'id') {
                item.notId = 1;
            }
            if(item.Data_type == 'int' && item.Column_name != 'id') {
                item.Data_type = 'number';
                item.min = '0';
            }
            else if(item.Data_type == 'varchar') {
                item.Data_type = 'text';
            }
        }
        context.dataColumns = results[0];
        res.render('update', context);
    }
});

//UPDATE car
app.post('/updateCar', function(req, res, next){
    var context = {};
    context.title = "Car";
    context.viewHref = '/cars';
    var idUpdated = req.body.id;
    context.idUpdated = idUpdated;
    var record = req.body;
    var updateRecord = makeNull(req.body); //check for possible null values
    var cancel = endUpdate(updateRecord);
    if(cancel.status){
        context.containsNull = 1;
        context.nullName = cancel.nullName;
        res.render('update', context);
    }else{
        var sql = 'UPDATE cars SET license_plate = ?, model_year = ?, make = ?, model_name = ? WHERE id = ?'; 
        var inserts = [updateRecord.license_plate, updateRecord.model_year, updateRecord.make, updateRecord.model_name, idUpdated];
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
                //console.log(results);
                context.changedRows = results.changedRows;
                res.render('update', context);
            }
        });
    }
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

//SEARCH cars
app.get('/searchCars', function(req, res, next) {
    var context = {};

    //set up the search substring
    var data = "%";
    data += req.query.search;
    data += "%";
    context.backHref = '/cars';
    context.title = 'Cars - filtered';
    var sql = 'SELECT cars.id, CONCAT(customer_id, " { ", f_name, " ", l_name, " }") as customer_name, '
    + 'license_plate, make, model_year, model_name '
    + 'FROM cars LEFT JOIN customers ON customer_id = customers.id '
    + 'WHERE (cars.id LIKE ? OR customer_id LIKE ? OR license_plate LIKE ? OR make LIKE ? OR model_name LIKE ? OR model_year LIKE ?) '
    + 'ORDER BY cars.id ASC;';
    var inserts = [data,data,data,data,data, data];
    sql += 'SELECT ?? FROM ?? WHERE ?? = ?';
    inserts.push('Column_name', 'Information_schema.columns', 'Table_name', 'cars');
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
        res.render('searchTable', context);
    }
});

/**************************************************************
 * Repair Orders
 * ************************************************************/

//VIEW repair_orders
app.get('/repairOrders', function(req, res, next) {
    var context = {};
    var tableName = 'repair_orders';
    context.addHref = '/addRepairOrder'
    context.searchHref = '/searchRepairOrders'
    context.deleteHref = '/deleteRepairOrder'
    context.repimg = '1'; //jumbotron image
    context.title = 'Repair Orders';
    context.relationship = 'M:M relationship with work_tasks via composite entity work_orders; 1:M relationship with cars; ';
    //first query for table records
    var sql = 'SELECT repair_orders.id, '
        + 'CONCAT(car_id, " { ", license_plate, " : ", model_year, " ", make, " ", model_name, " } ") as car_description, '
        + 'date_received, date_completed '
        + 'FROM repair_orders LEFT JOIN cars ON car_id = cars.id  '
        + 'ORDER BY repair_orders.id ASC; ';
    //second query for table column names
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
    context.postHref = '/addRepairOrder';
    //results[0] to get column names
    var sql = 'SELECT ??, ?? FROM ?? WHERE ?? = ?; ';
    var inserts = ['Column_name', 'Data_type', 'Information_schema.columns', 'Table_name', tableName];
    //results[1] to get customers
    sql += 'SELECT cars.id AS fk_id, CONCAT(license_plate, " : ", model_year, " ", make, " ", model_name) AS fk_name FROM cars ORDER BY cars.id ASC';
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
        results[0].forEach(getInputType);
        function getInputType(item) {
            if(item.Column_name != 'id') {
                item.notId = 1;
            }
            if(item.Column_name == 'car_id'){
                item.isForeignKey1 = 1;
            }
            if(item.Data_type == 'int') {
                item.Data_type = 'number';
                item.min = '0';
            }
            else if(item.Data_type == 'varchar') {
                item.Data_type = 'text';
            }
        }
        context.dataColumns = results[0];
        context.fk1 = results[1];
        res.render('add', context);
    }
});

//INSERT repair_orders
app.post('/addRepairOrder', function(req, res, next){
    context = {};
    context.title = 'Repair Order';
    context.addHref = '/addRepairOrder';
    context.viewHref= '/repairOrders';
    var newRecord = makeNull(req.body);
    var sql = 'INSERT INTO repair_orders (car_id, date_received, date_completed) VALUES (?';
    var inserts = [newRecord.car_id];
    if(newRecord.date_received === undefined || newRecord.date_received == ""){
        sql += ', NULL';
    }else {
        sql += ', ?';
        inserts.push(newRecord.date_received);
    }
    if(newRecord.date_completed === undefined || newRecord.date_completed == ""){
        sql += ', NULL)';
    }else {
        sql += ', ?)'
        inserts.push(newRecord.date_completed);
    }
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



//UPDATE FORM customers
app.get('/updateRepairOder', function(req, res, next){
    context = {};
    var tableName = 'repair_orders';
    context.title = 'Repair Order';
    context.postHref = '/updateRepairOrder';
    context.viewHref = '/repair_orders';
    //results[0] to get column names
    var sql = 'SELECT ??, ?? FROM ?? WHERE ?? = ?; ';
    var inserts = ['Column_name', 'Data_type', 'Information_schema.columns', 'Table_name', tableName];
   //results[1] to get current data in record
    sql += 'SELECT id, car_id, date_received, date_completed FROM repair_orders WHERE id = ?';
    inserts.push(req.query.id);
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
        //format input and values for each column
        results[0].forEach(getInputType);
        function getInputType(item) {
            //add current record values to columns
            results[1].forEach(getValue);
            function getValue(record){
                if(item.Column_name =='id'){
                    item.value = record.id;
                }
                else if(item.Column_name == 'car_id'){
                    item.value = record.car_id;
                }
                else if(item.Column_name == 'date_received'){
                    item.value = record.date_received;
                }
                else if(item.Column_name == 'date_completed'){
                    item.value = record.date_completed;
                }
            }
            //add input types to columns
            if(item.Column_name != 'id') {
                item.notId = 1;
            }
            if(item.Data_type == 'int' && item.Column_name != 'id') {
                item.Data_type = 'number';
                item.min = '0';
            }
            else if(item.Data_type == 'varchar') {
                item.Data_type = 'text';
            }
        }
        context.dataColumns = results[0];
        res.render('update', context);
    }
});

//UPDATE customer
app.post('/updateRepairOrder', function(req, res, next){
    var context = {};
    context.title = "Repair Order";
    context.viewHref = '/repair_orders';
    var idUpdated = req.body.id;
    context.idUpdated = idUpdated;
    var updateRecord = makeNull(req.body); //check for possible null values
    var cancel = endUpdate(updateRecord);
    if(cancel.status){
        context.containsNull = 1;
        context.nullName = cancel.nullName;
        res.render('update', context);
    }else{
        var sql = 'UPDATE customers SET car_id = ?, date_received = ?, date_completed = ?, WHERE id = ?'; 
        var inserts = [updateRecord.car_id, updateRecord.date_received, updateRecord.date_completed, idUpdated];
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
                //console.log(results);
                context.changedRows = results.changedRows;
                res.render('update', context);
            }
        });
    }
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

//SEARCH repair_orders
app.get('/searchRepairOrders', function(req, res, next) {
    var context = {};

    //set up the search substring
    var data = "%";
    data += req.query.search;
    data += "%";
    context.backHref = '/repairOrders';
    context.title = 'Repair Orders - filtered';
    var sql = 'SELECT repair_orders.id, '
    + 'CONCAT(car_id, " { ", model_year, " ", make, " ", model_name, " } ") as car_description, '
    + 'date_received, date_completed '
    + 'FROM repair_orders LEFT JOIN cars ON car_id = cars.id  '
    + 'WHERE (repair_orders.id LIKE ? OR car_id LIKE ? OR date_received LIKE ? OR date_completed LIKE ?) '
    +'ORDER BY repair_orders.id ASC ;'
    var inserts = [data,data, data, data];
    sql += 'SELECT ?? FROM ?? WHERE ?? = ?';
    inserts.push('Column_name', 'Information_schema.columns', 'Table_name', 'repair_orders');
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
        res.render('searchTable', context);
    }
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
    context.searchHref = "/searchWorkOrders";
    context.workimg = '1'; //jumbotron image
    context.title = 'Work Orders';
    context.relationship = 'Composite entity: 1:M relationship with repair_orders; 1:M relationship with work_tasks; 1:M relationship with mechanics';
    //work_order records
    var sql = 'SELECT work_orders.id, '
        + 'CONCAT(repair_order_id, " {", license_plate, " : ", model_year, " ", make, " ", model_name, "} ") AS repair, '
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
    //results[0] to get column naes
    var sql = 'SELECT ??, ?? FROM ?? WHERE ?? = ?; ';
    var inserts = ['Column_name', 'Data_type', 'Information_schema.columns', 'Table_name', tableName];
    //results[1] to get repair orders
    sql += 'SELECT repair_orders.id AS fk_id, CONCAT(license_plate, " : ", model_year, " ", make, " ", model_name) AS fk_name '
        + 'FROM repair_orders '
        + 'LEFT JOIN cars ON repair_orders.car_id = cars.id '
        + 'ORDER BY repair_orders.id ASC; ';
    //results[2] to get work tasks
    sql += 'SELECT work_tasks.id AS fk_id, name AS fk_name '
        + 'FROM work_tasks '
        + 'ORDER BY work_tasks.id; ';
    //results[3] to get mechanics
    sql += 'SELECT mechanics.id AS fk_id, CONCAT(f_name, " ", l_name) AS fk_name '
        + 'FROM mechanics '
        + 'ORDER BY mechanics.id ';
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
        results[0].forEach(getInputType);
        function getInputType(item) {
            if(item.Column_name != 'id') {
                item.notId = 1;
            }
            if(item.Column_name == 'repair_order_id'){
                item.isForeignKey1 = 1;
            }
            if(item.Column_name == 'work_task_id'){
                item.isForeignKey2 = 1;
            }
            if(item.Column_name == 'mechanic_id'){
                item.isForeignKey3 = 1;
            }
            if(item.Data_type == 'int') {
                item.Data_type = 'number';
                item.min = '0';
            }
            else if(item.Data_type == 'varchar') {
                item.Data_type = 'text';
            }
        }
        context.dataColumns = results[0];
        context.fk1 = results[1];
        context.fk2 = results[2];
        context.fk3 = results[3];
        res.render('add', context);
    }
});

//INSERT work_orders
app.post('/addWorkOrder', function(req, res, next){
    context = {};
    context.title = 'Work Order';
    context.addHref = '/addWorkOrder';
    context.viewHref= '/workOrders';
    var newRecord = makeNull(req.body);
    var sql = 'INSERT INTO work_orders (repair_order_id, work_task_id, mechanic_id, start_date, end_date) VALUES (?, ?, ?, ?, ?)';
    var inserts = [newRecord.repair_order_id, newRecord.work_task_id, newRecord.mechanic_id, newRecord.start_date, newRecord.end_date];
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

//SEARCH work_orders
app.get('/searchWorkOrders', function(req, res, next) {
    var context = {};

    //set up the search substring
    var data = "%";
    data += req.query.search;
    data += "%";
    context.backHref = '/workOrders';
    context.title = 'Work Orders - filtered';
    var sql = 'SELECT work_orders.id, '
    + 'CONCAT(repair_order_id, " {", license_plate, " : ", model_year, " ", make, " ", model_name, "} ") AS repair, '
    + 'CONCAT(work_task_id, " {", name, "} ") AS task, '
    + 'CONCAT(mechanic_id, " {", f_name, " ", l_name, "} ") AS mechanic, '
    + 'start_date, end_date '
    + 'FROM work_orders '
    + 'LEFT JOIN repair_orders ON repair_order_id = repair_orders.id '
    + 'LEFT JOIN cars ON repair_orders.car_id = cars.id '
    + 'LEFT JOIN work_tasks ON work_task_id = work_tasks.id '
    + 'LEFT JOIN mechanics ON mechanic_id = mechanics.id '
    + 'WHERE (work_orders.id LIKE ? OR repair_order_id LIKE ? OR work_task_id LIKE ? OR mechanic_id LIKE ? OR start_date LIKE ? OR end_date LIKE ?) '
    + 'ORDER BY work_orders.id ASC ;';
    var inserts = [data,data,data,data,data,data];
    sql += 'SELECT ?? FROM ?? WHERE ?? = ?';
    inserts.push('Column_name', 'Information_schema.columns', 'Table_name', 'work_orders');
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
        res.render('searchTable', context);
    }
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

