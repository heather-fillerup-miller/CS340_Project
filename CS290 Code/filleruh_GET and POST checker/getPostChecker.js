/*****************************************************************************
 * Author: Heather Fillerup- filleruh
 * Date: 02/18/2020
 * Last updated: 02/18/2020
 * Assignment: HW Assignment 5: Get/Post Checker
 * Description: Accomplishes the following:
 *   1. Upon receiving a POST request: 
 *       "Render" a page that has a H1 tag displaying "POST Request Received"
 *   2. Upon receiving a GET request: 
 *      "Render" a page that has a H1 tag displaying "GET Request Received"
 *   3. For both POST and GET:
 *      Below the H1 tag, displays table that shows all parameter names 
 *      and values which were sent in the URL query string for BOTH GET and POST
 *   4. For POST:
 *      Below the URL parameter table, displays another table that displays the property
 *      names and values that were received in the request body. Server accepts
 *      request bodies formatted as BOTH URL encoded query strings and JSON data.
 *****************************************************************************/

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 5425);
//accept URL encoded and JSON data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//get request
app.get('/', function (req, res) {
    //table for parameter names and values sent in URL
    var queryParams = [];
    for (var p in req.query) {
        queryParams.push({ 'name': p, 'value': req.query[p] });
    }
    var context = {};
    context.queryList = queryParams;
    context.type = 'Get';
    res.render('checker', context);
});

//post request
app.post('/', function (req, res) {
    //table for parameter names and values sent in URL
    var queryParams = [];
    for (var p in req.query) {
        queryParams.push({ 'name': p, 'value': req.query[p] });
    }
    //table for parameter names and values sent in body
    var bodyParams = [];
    for (var b in req.body) {
        bodyParams.push({ 'name': b, 'value': req.body[b] });
    }
    var context = {};
    context.queryList = queryParams;
    context.bodyList = bodyParams;
    context.type = 'POST';
    res.render('checker', context);
});

app.use(function (req, res) {
    res.type('text/plain');
    res.status(404);
    res.send('404 - not found');
})
app.use(function (err, req, res, next) {
    console.log(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - server error');
});

app.listen(app.get('port'), function () {
    console.log('Express started on port' + app.get('port') + 'press Ctr-C to terminate');
});
