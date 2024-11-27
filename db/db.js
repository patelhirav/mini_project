const mysql = require('mysql');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "mini_project",
});

db.connect(function (err) {
    if (err) throw err;
    console.log('Database Connected...');
});

module.exports = db;