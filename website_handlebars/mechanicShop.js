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

app.get('/customers', function(req, res, next) {
    var context = {};
    var tableName = 'customers'
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

app.get('/cars', function(req, res, next) {
    var context = {};
    var tableName = 'cars'
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

app.get('/mechanics', function(req, res, next) {
    var context = {};
    var tableName = 'mechanics'
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

app.get('/repair_orders', function(req, res, next) {
    var context = {};
    var tableName = 'repair_orders'
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

app.get('/work_tasks', function(req, res, next) {
    var context = {};
    var tableName = 'work_tasks'
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

app.get('/work_orders', function(req, res, next) {
    var context = {};
    var tableName = 'work_orders'
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

app.use(function(req, res) {
    var context = {};
    context.status = 404;
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next) {
    console.log(err.stack);
    res.status(500);
    res.render('500');
})

app.listen(app.get('port'), function() {
    console.log('Express started on port: ' + app.get('port') + '; press Ctrl-C to terminate');
});