var express = require('express');
var router = express.Router();
import mysql2 from 'mysql2';
// import express from 'express';
var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

const connection = mysql2.createConnection({
    host: "localhost",
    database: "pawspantry", 
    user: "root", 
    password: ""
})

const app = express();

const PORT = 3306; 
app.listen(PORT, () => {
    console.log(`Server : http://localhost:${PORT}`)
    connection.connect((err) => {
        if(err) throw err; 
        console.log("The database is connected");
    })
});

app.get('/students', async function (req, res, next) {
    const sql_query = `SELECT * FROM students;`
    connection.query(sql_query, (err, results) => {
        if(err) throw err; 
        res.json(results);
    });
});

module.exports = router;
