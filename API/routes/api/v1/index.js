const express = require('express');
const router = express.Router();
const mysql2 = require('mysql2');
const env = process.env.NODE_ENV;

// process.env.

// let config;
// if (env === 'production') {
//     config = require('../knexfile.js')[env];
// } else {
//     config = require('../local-knexfile.js')[env];
// }

// const connection = mysql2.createConnection({
//     host: "localhost",
//     database: "pawspantry", 
//     user: "root", 
//     password: ""
// })

const connection = mysql2.createConnection({
    host: env.hostName,
    database: env.databaseName, 
    user: env.databaseUser, 
    password: env.databasePassword
})

const app = express();

const PORT = 8000; 
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
