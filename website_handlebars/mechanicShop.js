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

app.get('/home', function(req, res, next) {
    var context = {};
    context.title = 'Dashboard';
    res.render('home', context);
});

/****Customers****/

//Displays Customer Table with buttons to Search, Add, Update, Delete
app.get('/customers', function(req, res, next) {
    var context = {};
    var tableName = 'customers'; 
    context.addHref = '/addCustomer';
    context.title = 'Customers';
    var sql = 'SELECT * FROM ?? ; SELECT ?? FROM ?? WHERE ?? = ?';
    var inserts = [tableName, 'Column_name', 'Information_schema.columns', 'Table_name', tableName];
    mysql.pool.query(sql, inserts, function(err, results){
        if(err){
            throw err;
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

//Displays Form to add Customer
app.get('/addCustomer', function(req, res, next) {
    var context = {};
    var tableName = 'customers'
    context.title = 'New Customer';
    var sql = 'SELECT ??, ?? FROM ?? WHERE ?? = ?';
    var inserts = ['Column_name', 'Data_type', 'Information_schema.columns', 'Table_name', tableName];
    mysql.pool.query(sql, inserts, function(err, results){
        if(err){
            throw err;
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
            //if boolean data type add to context to make select option
            else if(item.Data_type == 'tinyint') {
                item.boolean = 1;
            }
        }
        context.dataColumns = results;
        res.render('add', context);
    }
});

/****Cars****/

//Displays cars table with search, add, update and delete buttons
app.get('/cars', function(req, res, next) {
    var context = {};
    var tableName = 'cars';
    context.addHref = '/addCustomer';
    context.title = 'Cars';
    var sql = 'SELECT * FROM ?? ; SELECT ?? FROM ?? WHERE ?? = ?';
    var inserts = [tableName, 'Column_name', 'Information_schema.columns', 'Table_name', tableName];
    mysql.pool.query(sql, inserts, function(err, results){
        if(err){
            throw err;
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

//Displays Form to add Car
app.get('/addCar', function(req, res, next) {
    var context = {};
    var tableName = 'cars';
    context.title = 'New Car';
    var sql = 'SELECT ??, ?? FROM ?? WHERE ?? = ?';
    var inserts = ['Column_name', 'Data_type', 'Information_schema.columns', 'Table_name', tableName];
    mysql.pool.query(sql, inserts, function(err, results){
        if(err){
            throw err;
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
            //if boolean data type add to context to make select option
            else if(item.Data_type == 'tinyint') {
                item.boolean = 1;
            }
        }
        context.dataColumns = results;
        res.render('add', context);
    }
});

/****Mechanics****/

//Displays mechanics table with search, add, update and delete buttons
app.get('/mechanics', function(req, res, next) {
    var context = {};
    var tableName = 'mechanics';
    context.addHref = '/addMechanic';
    context.title = 'Mechanics';
    var sql = 'SELECT * FROM ?? ; SELECT ?? FROM ?? WHERE ?? = ?';
    var inserts = [tableName, 'Column_name', 'Information_schema.columns', 'Table_name', tableName];
    mysql.pool.query(sql, inserts, function(err, results){
        if(err){
            throw err;
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

//Displays Form to add Mechanic
app.get('/addMechanic', function(req, res, next) {
    var context = {};
    var tableName = 'mechanics';
    context.title = 'New Mechanic';
    var sql = 'SELECT ??, ?? FROM ?? WHERE ?? = ?';
    var inserts = ['Column_name', 'Data_type', 'Information_schema.columns', 'Table_name', tableName];
    mysql.pool.query(sql, inserts, function(err, results){
        if(err){
            throw err;
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
            //if boolean data type add to context to make select option
            else if(item.Data_type == 'tinyint') {
                item.boolean = 1;
            }
        }
        context.dataColumns = results;
        res.render('add', context);
    }
});

/****Repair Orders****/

//Displays repair_orders table with search, add, update and delete buttons
app.get('/repairOrders', function(req, res, next) {
    var context = {};
    var tableName = 'repair_orders';
    context.addHref = '/addRepairOrder'
    context.title = 'Repair Orders';
    var sql = 'SELECT * FROM ?? ; SELECT ?? FROM ?? WHERE ?? = ?';
    var inserts = [tableName, 'Column_name', 'Information_schema.columns', 'Table_name', tableName];
    mysql.pool.query(sql, inserts, function(err, results){
        if(err){
            throw err;
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

//Displays Form to add Repair Order
app.get('/addRepairOrder', function(req, res, next) {
    var context = {};
    var tableName = 'repair_orders';
    context.title = 'New Repair Order';
    var sql = 'SELECT ??, ?? FROM ?? WHERE ?? = ?';
    var inserts = ['Column_name', 'Data_type', 'Information_schema.columns', 'Table_name', tableName];
    mysql.pool.query(sql, inserts, function(err, results){
        if(err){
            throw err;
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
            //if boolean data type add to context to make select option
            else if(item.Data_type == 'tinyint') {
                item.boolean = 1;
            }
        }
        context.dataColumns = results;
        res.render('add', context);
    }
});

/****Work Tasks****/

//Displays work_tasks table with search, add, update and delete buttons
app.get('/workTasks', function(req, res, next) {
    var context = {};
    var tableName = 'work_tasks';
    context.addHref = '/addWorkTask';
    context.title = 'Work Tasks';
    var sql = 'SELECT * FROM ?? ; SELECT ?? FROM ?? WHERE ?? = ?';
    var inserts = [tableName, 'Column_name', 'Information_schema.columns', 'Table_name', tableName];
    mysql.pool.query(sql, inserts, function(err, results){
        if(err){
            throw err;
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

//Displays Form to add Work Tasks
app.get('/addWorkTask', function(req, res, next) {
    var context = {};
    var tableName = 'work_tasks';
    context.title = 'New Work Task';
    var sql = 'SELECT ??, ?? FROM ?? WHERE ?? = ?';
    var inserts = ['Column_name', 'Data_type', 'Information_schema.columns', 'Table_name', tableName];
    mysql.pool.query(sql, inserts, function(err, results){
        if(err){
            throw err;
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
            //if boolean data type add to context to make select option
            else if(item.Data_type == 'tinyint') {
                item.boolean = 1;
            }
        }
        context.dataColumns = results;
        res.render('add', context);
    }
});

/****Work Orders****/

//Displays work_orders table with search, add, update and delete buttons
app.get('/workOrders', function(req, res, next) {
    var context = {};
    var tableName = 'work_orders';
    context.addHref = '/addWorkOrder';
    context.title = 'Work Orders';
    var sql = 'SELECT * FROM ?? ; SELECT ?? FROM ?? WHERE ?? = ?';
    var inserts = [tableName, 'Column_name', 'Information_schema.columns', 'Table_name', tableName];
    mysql.pool.query(sql, inserts, function(err, results){
        if(err){
            throw err;
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

//Displays Form to add work_orders
app.get('/addWorkOrder', function(req, res, next) {
    var context = {};
    var tableName = 'work_orders';
    context.title = 'New Work Order';
    var sql = 'SELECT ??, ?? FROM ?? WHERE ?? = ?';
    var inserts = ['Column_name', 'Data_type', 'Information_schema.columns', 'Table_name', tableName];
    mysql.pool.query(sql, inserts, function(err, results){
        if(err){
            throw err;
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
            //if boolean data type add to context to make select option
            else if(item.Data_type == 'tinyint') {
                item.boolean = 1;
            }
        }
        context.dataColumns = results;
        res.render('add', context);
    }
});

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

app.listen(app.get('port'), function() {
    console.log('Express started on port: ' + app.get('port') + '; press Ctrl-C to terminate');
});