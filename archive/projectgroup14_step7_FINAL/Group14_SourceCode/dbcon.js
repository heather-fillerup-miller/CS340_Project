//mysql connection
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit :   10,
    host            :   'classmysql.engr.oregonstate.edu',
    user            :   'cs340_[your_username]',
    password        :   '[your_password]',
    database        :   'cs340_[your_username]',
    multipleStatements: true
});

module.exports.pool = pool;