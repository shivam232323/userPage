const mysql = require('mysql');



const pool = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "shivamsingh",
    database: "user"
  });
  

module.exports = pool;

