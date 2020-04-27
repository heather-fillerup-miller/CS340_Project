//mysql connection
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit :   10,
    host            :   'classmysql.engr.oregonstate.edu',
    user            :   'cs290_filleruh',
    password        :   '2733',
    database        :   'cs290_filleruh' 
});

module.exports.pool = pool;