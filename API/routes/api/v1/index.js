const express = require('express');
const router = express.Router();
const mysql2 = require('mysql2');
const env = process.env.NODE_ENV;

// const connection = mysql2.createConnection({
//     host: "localhost",
//     database: "pawspantry", 
//     user: "root", 
//     password: ""
// })

const connection = mysql2.createConnection({
    host: process.env.hostName,
    database: process.env.databaseName, 
    user: process.env.databaseUser, 
    password: process.env.databasePassword
});

const app = express();

const PORT = 8000; 
app.listen(PORT, () => {
    console.log(`Server : http://localhost:${PORT}`)
    connection.connect((err) => {
        if(err) throw err; 
        console.log("The database is connected");
    })
});

// Getting all the student data in the database 
app.get('/students', async function (req, res, next) {
    const sql_query = `SELECT * FROM students;`;
    connection.query(sql_query, (err, results) => {
        if(err) throw err; 
        var statement = `All student information returned`;
        console.log(statement);
        res.json(results);
    });
});

// Inserting new student info into database 
app.post('/students/newStudents', function(req, res){
    var studentID=req.body.studentID;
    var firstName=req.body.firstName;
    var lastName=req.body.lastName;
    var email=req.body.email;

    var values = [
        [studentID, firstName, lastName, email]
    ];

    const sql_query = "INSERT INTO `students` (studentID, firstName, lastName, email) VALUES (?, ?, ?, ?);";

    connection.query(sql_query, [values].toString(), function(err, result){
        if(err) throw err;
        var statement = `One record inserted`;
        console.log(statement);
    });
    res.send(values);
});

// Finding student by student ID 
app.delete('/students/findStudent/:studentID', function(req, res) {
    var studentID=req.body.studentID;

    const sql_query = `SELECT * FROM students WHERE studentID = '${studentID}';`;

    connection.query(sql_query, [values].toString(), function(err, result){
        if(err) throw err;
        var statement = `One student record returned`;
        console.log(statement);
        res.json(result);
    });
});

// Deleting student schedule by student ID
app.delete('/students/delete/:studentID', function(req, res) {
    var studentID=req.body.studentID;

    const sql_query = `DELETE FROM students WHERE studentID = '${studentID}';`;

    connection.query(sql_query, [values].toString(), function(err, result){
        if(err) throw err;
        var statement = `Student "${studentID}" records has been removed`;
        console.log(statement);
    });
});

module.exports = router;
