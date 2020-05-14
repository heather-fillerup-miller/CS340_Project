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

app.get('/', function(req, res, next) {
    var context = {};
    res.render('home', context);
});

//send data currently in database
app.put('/', function(req,res,next){
    sendExerciseData(req, res, next);
});

app.post('/', function(req, res, next){
    //update record if there is an id
    if(req.body.id) {
        mysql.pool.query('UPDATE `workouts` SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=?',
        [req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.lbs, req.body.id],
        function(err, result) {
           if (err) {
              next(err);
              return;
          }
          sendExerciseData(req, res, next);
        });    
    }
    //no id for new records so create new one
    else if(req.body.id == null) {
        mysql.pool.query('INSERT INTO `workouts` (`name`,`reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ?, ?, ?)',
        [req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.lbs],
        function(err, result){
            if(err){
                next(err);
                return;
            }
        sendExerciseData(req,res,next);
     });
    }
});

app.delete('/', function(req, res, next) {
    mysql.pool.query('DELETE FROM `workouts` WHERE id=?', [req.query.id], function(err,result){
        if(err) {
            next(err);
            return;
        }
        sendExerciseData(req, res, next);
    });
});

app.get('/reset-table', function(req, res, next){
    var context = {};
    mysql.pool.query('DROP TABLE IF EXISTS workouts', function(err){
        if(err) {
            next(err);
            return;
        }
        var createString = 'CREATE TABLE workouts(' +
            'id INT PRIMARY KEY AUTO_INCREMENT,' +
            'name VARCHAR(255) NOT NULL,' +
            'reps INT,' +
            'weight INT,' +
            'date DATE,' +
            'lbs BOOLEAN)';
        mysql.pool.query(createString, function(err){
            if(err) {
                next(err);
                return;
            }
            context.results = 'Table reset';
            res.render('home', context);
        });
    });
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

function sendExerciseData(req, res, next) {
    mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
        if(err) {
            next(err);
            return;
        }
        res.type('application/json');
        res.send(rows);
    });
}