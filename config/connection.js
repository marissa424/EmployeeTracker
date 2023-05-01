const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3001,
  user: 'root',
  password: 'Algorithms21',
  database: 'employees'
});

module.exports = connection;
