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
    /*mysql.pool.query('SELECT Column_name FROM Information_schema.columns WHERE Table_name = ' + tableName, function(err, rows, fields){
        if(err) {
            next(err);
            return;
        }
        context.columnResults = rows;
    });*/
    mysql.pool.query('SELECT * FROM Customers', function(err,rows){
        if(err){
            throw err;
        }else {
            renderPage(rows);
        }
    });
    function renderPage(value) {
        context.dataRows = value;
        res.render('customers', context);
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