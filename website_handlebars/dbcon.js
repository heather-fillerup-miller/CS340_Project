//mysql connection
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit :   10,
    host            :   'classmysql.engr.oregonstate.edu',
    user            :   'cs340_filleruh',
    password        :   '2733',
    database        :   'cs340_filleruh',
    multipleStatements: true
});

module.exports.pool = pool;