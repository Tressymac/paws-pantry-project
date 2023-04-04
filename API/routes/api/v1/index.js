const express = require('express');
const router = express.Router();
const mysql2 = require('mysql2');
const env = process.env.NODE_ENV;
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const connection = mysql2.createConnection({
    host: 'localhost',
    database: process.env.databaseName, 
    user: process.env.databaseUser, 
    password: process.env.databasePassword
});

const PORT = 8000; 
app.listen(PORT, () => {
    console.log(`Server : http://localhost:${PORT}`);
    console.log(process.env.hostName);
    connection.connect((err) => {
        if(err) throw err; 
        console.log("The database is connected");
    })
});

// Root route
app.get('/', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.send('Root API route');
});

// Getting all the student data in the database 
app.get('/api/v1/students', async function (req, res, next) {
    const sql_query = `SELECT * FROM students;`;
    connection.query(sql_query, (err, results) => {
        if(err) throw err; 
        var statement = `All student information returned`;
        console.log(statement);
        res.header("Access-Control-Allow-Origin", "*");
        res.json(results);
    });
});

// Getting all the admin data in the database 
app.get('/api/v1/admin', async function (req, res, next) {
    const sql_query = `SELECT * FROM admin;`;
    connection.query(sql_query, (err, results) => {
        if(err) throw err; 
        var statement = `All admin information returned`;
        console.log(statement);
        res.header("Access-Control-Allow-Origin", "*");
        res.json(results);
    });
});

// 
app.get('/admin', async function (req, res, next) {
    const sql_query = `SELECT * FROM admin;`
    connection.query(sql_query, (err, results) => {
        if(err) throw err; 
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

app.get('/admin', async function (req, res, next) {
    const sql_query = `SELECT * FROM admin;`
    connection.query(sql_query, (err, results) => {
        if(err) throw err; 
        res.json(results);
    });
    

});

// Inserting new student info into database 
app.post('/api/v1/students/newStudents', function(req, res){    
    var studentID = req.body.studentID;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;

    var values = [
        [studentID, firstName, lastName, email]
    ];

    console.log("This is the returned value: " + values);

    const sql_query = `INSERT INTO students (studentID, firstName, lastName, email) VALUES ('${studentID}', '${firstName}', '${lastName}', '${email}');`;

    connection.query(sql_query, function(err, result){
        if(err) throw err;
        var statement = `One record inserted`;
        console.log(statement);
    });
    res.send(values);
});

// Inserting new admin info into database 
app.post('/api/v1/admin/newAdmin', function(req, res){    
    var adminID = req.body.adminID;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var password = req.body.password;

    var values = [
        [adminID, firstName, lastName, email, password]
    ];

    console.log("This is the returned value: " + values);

    const sql_query = `INSERT INTO admin (adminID, firstName, lastName, email, password) VALUES ('${adminID}', '${firstName}', '${lastName}', '${email}', '${password}');`;

    connection.query(sql_query, function(err, result){
        if(err) throw err;
        var statement = `One record inserted`;
        console.log(statement);
    });
    res.send(values);
});

// Finding student by student ID 
app.get('/api/v1/students/findStudent/:studentID', function(req, res) {
    var studentID=req.params.studentID;

    const sql_query = `SELECT * FROM students WHERE studentID = '${studentID}';`;

    connection.query(sql_query, function(err, result){
        if(err) throw err;
        var statement = `One student record returned`;
        console.log(statement);
        res.json(result);
    });
});

// Finding admin by admin ID 
app.get('/api/v1/admin/findAdmin/:adminID', function(req, res) {
    var adminID=req.params.adminID;

    const sql_query = `SELECT * FROM admin WHERE adminID = '${adminID}';`;

    connection.query(sql_query, function(err, result){
        if(err) throw err;
        var statement = `One admin record returned`;
        console.log(statement);
        res.json(result);
    });
});

// Finding timeslots by timeslot ID 
app.get('/api/v1/timeslots/findTimeslots/:timeSlotID', function(req, res) {
    var timeSlotID = req.params.timeSlotID;

    const sql_query = `SELECT * FROM timeSlots WHERE timeSlotID = '${timeSlotID}';`;

    connection.query(sql_query, function(err, result){
        if(err) throw err;
        var statement = `Time slot record has been returned`;
        console.log(statement);
        res.json(result);
    });
});

// Deleting student by student ID
app.delete('/api/v1/students/delete/studentByID', function(req, res) {
    var studentID=req.body.studentID;

    const sql_query = `DELETE FROM students WHERE studentID = '${studentID}';`;
    console.log(sql_query);

    connection.query(sql_query, function(err, result){
        if(err) throw err;
        var statement = `Student "${studentID}" records has been removed`;
        console.log(statement);
        res.json(statement);
    });
});

// Deleting admin by admin ID
app.delete('/api/v1/admin/delete/adminByID', function(req, res) {
    var adminID=req.body.adminID;

    const sql_query = `DELETE FROM admin WHERE adminID = '${adminID}';`;
    console.log(sql_query);

    connection.query(sql_query, function(err, result){
        if(err) throw err;
        var statement = `Admin "${adminID}" records has been removed`;
        console.log(statement);
        res.json(statement);
    });
});

// Updating first student name by student ID 
app.post('/api/v1/students/update/firstName/:studentByID', function(req, res) {
    var studentID=req.body.studentID;
    var newFirstName = req.body.newFirstName;

    const sql_query = `UPDATE students SET firstName = '${newFirstName}' WHERE studentID = '${studentID}';`;
    console.log(sql_query);

    connection.query(sql_query, function(err, result){
        if (err) throw err;
        var statement = `Student "${studentID}" records has been updated`;
        console.log(result.affectedRows + ": " + statement);
    });
});

// Updating first admin name by admin ID 
app.patch('/api/v1/admin/update/firstName/adminByID', function(req, res) {
    var adminID=req.body.adminID;
    var newFirstName = req.body.newFirstName;

    const sql_query = `UPDATE admin SET firstName = '${newFirstName}' WHERE adminID = '${adminID}';`;
    console.log(sql_query);

    connection.query(sql_query, function(err, result){
        if (err) throw err;
        var statement = `Admin "${adminID}" records has been updated`;
        console.log(result.affectedRows + ": " + statement);
    });
});

// Updating last student name by student ID 
app.post('/api/v1/students/update/lastName/:studentByID', function(req, res) {
    var studentID=req.body.studentID;
    var newLastName = req.body.newFirstName;

    const sql_query = `UPDATE students SET lastName = '${newLastName}' WHERE studentID = '${studentID}';`;
    console.log(sql_query);

    connection.query(sql_query, function(err, result){
        if (err) throw err;
        var statement = `Student "${studentID}" records has been updated`;
        console.log(result.affectedRows + ": " + statement);
    });
});

// Updating last admin name by admin ID 
app.post('/api/v1/admin/update/lastName/:adminByID', function(req, res) {
    var adminID=req.body.adminID;
    var newLastName = req.body.newFirstName;

    const sql_query = `UPDATE admin SET lastName = '${newLastName}' WHERE adminID = '${adminID}';`;
    console.log(sql_query);

    connection.query(sql_query, function(err, result){
        if (err) throw err;
        var statement = `Admin "${adminID}" records has been updated`;
        console.log(result.affectedRows + ": " + statement);
    });
});

// Updating password of admin by admin ID 
app.post('/api/v1/admin/update/password/:adminByID', function(req, res) {
    var adminID=req.body.adminID;
    var newPassword = req.body.newPassword;

    const sql_query = `UPDATE admin SET password = '${newPassword}' WHERE adminID = '${adminID}';`;
    console.log(sql_query);

    connection.query(sql_query, function(err, result){
        if (err) throw err;
        var statement = `Admin "${adminID}" records has been updated`;
        console.log(result.affectedRows + ": " + statement);
    });
});

module.exports = router;
