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

app.get('/customers', function(req, res, next) {
    var context = {};
    mysql.pool.query('SELECT * FROM customers', function(err,rows){
        if(err){
            throw err;
        }else {
            renderCustomers(rows);
        }
    });
    function renderCustomers(value) {
        context.dataRows = value;
        res.render('customers', context);
    }
});

app.get('/cars', function(req, res, next) {
    var context = {};
    mysql.pool.query('SELECT * FROM cars', function(err,rows){
        if(err){
            throw err;
        }else {
            renderCars(rows);
        }
    });
    function renderCars(value) {
        context.dataRows = value;
        res.render('cars', context);
    }
});

app.get('/mechanics', function(req, res, next) {
    var context = {};
    mysql.pool.query('SELECT * FROM mechanics', function(err,rows){
        if(err){
            throw err;
        }else {
            renderMechanics(rows);
        }
    });
    function renderMechanics(value) {
        context.dataRows = value;
        res.render('mechanics', context);
    }
});

app.get('/repair_orders', function(req, res, next) {
    var context = {};
    mysql.pool.query('SELECT * FROM repair_orders', function(err,rows){
        if(err){
            throw err;
        }else {
            renderOrders(rows);
        }
    });
    function renderOrders(value) {
        context.dataRows = value;
        res.render('repair_orders', context);
    }
});

app.get('/work_tasks', function(req, res, next) {
    var context = {};
    mysql.pool.query('SELECT * FROM work_tasks', function(err,rows){
        if(err){
            throw err;
        }else {
            renderTasks(rows);
        }
    });
    function renderTasks(value) {
        context.dataRows = value;
        res.render('work_tasks', context);
    }
});

app.get('/work_orders', function(req, res, next) {
    var context = {};
    mysql.pool.query('SELECT * FROM work_orders', function(err,rows){
        if(err){
            throw err;
        }else {
            renderW_Orders(rows);
        }
    });
    function renderW_Orders(value) {
        context.dataRows = value;
        res.render('work_orders', context);
    }
});

app.use(function(req, res) {
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