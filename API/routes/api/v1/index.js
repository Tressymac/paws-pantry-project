const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const sql = require('mssql');
const env = process.env.NODE_ENV;
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const connection = mysql.createConnection({
    host: process.env.DB_HOSTNAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'pantry-data',
    ssl: {
        ca: process.env.DB_SSL_CA, // path to the CA certificate file
        rejectUnauthorized: false
    }
});

const PORT = 8000; 

connection.connect(function(err) {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database!');
});

app.listen(PORT, () => {
    console.log(`Server : http://localhost:${PORT}`);
    console.log(process.env.hostName);
});

app.options('/api/v1/timeslot/update/:timeSlotID', function(req, res) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).send();
});

// Updating all timeslot name by timeslot ID 
app.post('/api/v1/timeslot/update/:timeSlotID', function(req, res) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    var timeSlotID = req.body.timeSlotID;
    var day = req.body.day;
    var time = req.body.time;
    var filled = req.body.filled;

    const sql_query = `UPDATE timeSlots SET day = '${day}', time = '${time}', filled = ${filled} WHERE timeSlotID = '${timeSlotID}';`;
    console.log(sql_query);

    connection.query(sql_query, function(err, result){
        if (err) throw err;
        var statement = `timeslot "${timeSlotID}" records has been updated`;
        console.log(result.affectedRows + ": " + statement);
    });
});

app.options('/api/v1/timeSlots/newTimeSlots', function(req, res) {
    // res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).send();
});
  
//Post a new timeslot to the database
app.post('/api/v1/timeSlots/newTimeSlots', function(req, res) {
    var selectedDay = req.body.selectedDay;
    var time = req.body.time;
    var filled = false;
  
    var values = [
      [selectedDay, time, filled]
    ];
  
    console.log("This is the returned value: " + values);
    const sql_query = `INSERT INTO timeSlots (day, time, filled) VALUES ('${selectedDay}', '${time}', ${filled});`;
    connection.query(sql_query, function(err, result) {
      if (err) throw err;
      var statement = `The new time info has been updated.`;
      console.log(statement);
    });
    // res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.send(values);
});
  
// Root route
app.get('/', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.send('Root API route');
});

// Getting all the client data in the database 
app.get('/api/v1/clients', async function (req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    const sql_query = `SELECT * FROM clients;`;
    connection.query(sql_query, (err, results) => {
        if(err) throw err; 
        var statement = `All clients information returned`;
        console.log(statement);
        res.json(results);
    });
});

// Getting all the timeslots data in the database 
app.get('/api/v1/timeSlots', async function (req, res, next) {
    const sql_query = `SELECT * FROM timeSlots;`;
    connection.query(sql_query, (err, results) => {
        if(err) throw err; 
        var statement = `All timeSlots information returned`;
        console.log(statement);
        res.header("Access-Control-Allow-Origin", "*");
        res.json(results);
    });
});

// Getting all the appointments data in the database 
app.get('/api/v1/appointments', async function (req, res, next) {
    const sql_query = `SELECT * FROM appointments;`;
    connection.query(sql_query, (err, results) => {
        if(err) throw err; 
        var statement = `All appointments information returned`;
        console.log(statement);
        res.header("Access-Control-Allow-Origin", "*");
        res.json(results);
    });
});

// Getting all the clients data in the database 
app.get('/api/v1/clients', async function (req, res, next) {
    const sql_query = `SELECT * FROM clients;`;
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

app.options('/api/v1/clients/newclients', function(req, res) {
    // res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).send();
});

// Inserting new clients info into database 
app.post('/api/v1/clients/newclients', function(req, res){  
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');  
    var clientID = req.body.clientID;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var standing = req.body.standing;
    var street_address = req.body.street_address;
    var Address_line_2 = req.body.Address_line_2;
    var city = req.body.city;
    var zip_code = req.body.zip_code;
    var state = req.body.state;
    var county = req.body.county;
    var numAdults = req.body.numAdults;
    var numChildren05 = req.body.numChildren05
    var numChildren618 = req.body.numChildren618;
    var employment = req.body.employment;

    var values = [
        [clientID, firstName, lastName, email]
    ];

    console.log("This is the returned value: " + values);

    const sql_query = `INSERT INTO clients (clientID, firstName, lastName, email, standing, street_address, Address_line_2, city, zip_code, state, county, numAdults, numChildren05, numChildren618, employment) VALUES ('${clientID}', '${firstName}', '${lastName}', '${email}', '${standing}', '${street_address}', '${Address_line_2}', '${city}', '${zip_code}', '${state}', '${county}', '${numAdults}', '${numChildren05}', '${numChildren618}', '${employment}');`;

    connection.query(sql_query, function(err, result){
        if(err) throw err;
        var statement = `One New Client record inserted`;
        console.log(statement);
    });
    res.send(values);
});

app.options('/api/v1/clients/:clientID/:firstName', function(req, res) {
    // res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
    // res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).send();
});
// finding clients by client id and first name
app.get('/api/v1/clients/:clientID/:firstName', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');    
    const { clientID, firstName } = req.params;
    const sql_query = `SELECT * FROM clients WHERE clientID = '${clientID}' AND firstName = '${firstName}';`;
    connection.query(sql_query, function(err, result){
        if(err) throw err;
        var statement = `One New Client record returned`;
        console.log(statement);
        res.json(result);
    });
});

// app.post('/api/v1/timeSlots/newTimeSlots', function(req, res){    
//     var day = req.body.day;
//     var time = req.body.time;
//     var filled = false;

//     var values = [
//         [day, time, filled]
//     ];

//     console.log("This is the returned value: " + values);
//     const sql_query = `INSERT INTO timeSlots (day, time, filled) VALUES ('${day}', '${time}', ${filled});`;
//     connection.query(sql_query, function(err, result){
//         res.header("Access-Control-Allow-Origin", "*");
//         if(err) throw err;
//         var statement = `The new time info has been updated.`;
//         console.log(statement);
//     });
//     res.send(values);
// });


// Finding clients by clients ID 
app.get('/api/v1/clients/findclients/:clientID', function(req, res) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type'); 
    var clientID=req.params.clientID;
    console.log(clientID)
    const sql_query = `SELECT * FROM clients WHERE clientID = '${clientID}';`;

    connection.query(sql_query, function(err, result){
        if(err) throw err;
        var statement = `One clients record returned`;
        console.log(statement);
        res.json(result);
    });
});

// Finding appointments by clientID
app.get('/api/v1/appointments/findAppointments/:clientID', function(req, res) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type'); 
    var clientID=req.params.clientID;
    const sql_query = `SELECT * FROM appointments WHERE clientID = '${clientID}';`;

    connection.query(sql_query, function(err, result){
        if(err) throw err;
        var statement = `Appointments record returned`;
        console.log(statement);
        res.header("Access-Control-Allow-Origin", "*");
        res.json(result);
    });
});

// Finding timeslots by timeslot ID 
app.get('/api/v1/timeslots/findTimeslots/:timeSlotID', function(req, res) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type'); 
    var timeSlotID = req.params.timeSlotID;

    const sql_query = `SELECT * FROM timeSlots WHERE timeSlotID = '${timeSlotID}';`;

    connection.query(sql_query, function(err, result){
        res.header("Access-Control-Allow-Origin", "*");
        if(err) throw err;
        var statement = `Time slot record has been returned`;
        console.log(statement);
        res.json(result);
    });
});

// Deleting timeslot schedule by timeslot ID
app.options('/api/v1/timeslot/delete/:timeSlotID', function(req, res) {
    // res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).send();
});

app.delete('/api/v1/timeslot/delete/:timeSlotID', function(req, res) {
    var timeSlotID = req.params.timeSlotID;
    res.header("Access-Control-Allow-Origin", "*");

    const secondSql_query = `DELETE FROM appointments WHERE timeSlotID = '${timeSlotID}';`;
    const sql_query = `DELETE FROM timeSlots WHERE timeSlotID = '${timeSlotID}';`;
    console.log(sql_query);

    connection.query(secondSql_query, function(err, result){
        if(err) throw err;
        var statement = `Appointments with Timeslot ID of "${timeSlotID}" has been removed`;
        connection.query(sql_query, function(err, result){
            if(err) throw err;
            var statement = `Timeslot "${timeSlotID}" records has been removed`;
            console.log(statement);
        });
        console.log(statement);
        res.send(statement);
    });
});

// Deleting appointments schedule by appointment ID
app.options('/api/v1/appointments/delete/:appointmentID', function(req, res) {
    // res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).send();
});

app.delete('/api/v1/appointments/delete/:appointmentID', function(req, res) {
    var appointmentID=req.params.appointmentID;
    res.header("Access-Control-Allow-Origin", "*");

    const sql_query = `DELETE FROM appointments WHERE appointmentID = '${appointmentID}';`;
    console.log(sql_query);

    connection.query(sql_query, function(err, result){
        if(err) throw err;
        var statement = `Appointments "${appointmentID}" records has been removed`;
        console.log(statement);
        res.json(statement);
    });
});

// Deleting clients schedule by client ID
app.delete('/api/v1/clients/delete/clientByID', function(req, res) {
    var clientID=req.body.clientByID;
    res.header("Access-Control-Allow-Origin", "*");

    const sql_query = `DELETE FROM clients WHERE clientID = '${clientID}';`;
    console.log(sql_query);

    connection.query(sql_query, function(err, result){
        if(err) throw err;
        var statement = `Client "${clientID}" records has been removed`;
        console.log(statement);
        res.json(statement);
    });
});

// Updating first student name by student ID 
app.post('/api/v1/students/update/:studentByID', function(req, res) {
    var studentID=req.body.studentID;
    var newFirstName = req.body.newFirstName;

    const sql_query = `UPDATE students SET firstName = '${newFirstName}' WHERE studentID = '${studentID}';`;
    console.log(sql_query);

    connection.query(sql_query, function(err, result){
        if (err) throw err;
        var statement = `Student "${studentID}" records has been updated`;
        res.header("Access-Control-Allow-Origin", "*");
        console.log(result.affectedRows + ": " + statement);
    });
});

// Updating last student name by student ID 
app.post('/api/v1/students/update/:studentByID', function(req, res) {
    var studentID=req.body.studentID;
    var newLastName = req.body.newFirstName;

    const sql_query = `UPDATE students SET lastName = '${newLastName}' WHERE studentID = '${studentID}';`;
    console.log(sql_query);

    connection.query(sql_query, function(err, result){
        if (err) throw err;
        var statement = `Student "${studentID}" records has been updated`;
        res.header("Access-Control-Allow-Origin", "*");
        console.log(result.affectedRows + ": " + statement);
    });
});

app.options('/api/v1/appointments/newAppointments', function(req, res) {
    // res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).send();
});

// Post a new appt into the database
// Also updates the time slot to filled 
app.post('/api/v1/appointments/newAppointments',function(req,res){
    var clientID = req.body.clientID;
    var timeSlotID = req.body.timeSlotID;
    res.header("Access-Control-Allow-Origin","*");

    var values = [
    [ clientID, timeSlotID]
    ];
    console.log("This is the returned value: " + values);
   
    const sql_query = `INSERT INTO appointments (clientID, timeSlotID) VALUES ('${clientID}', '${timeSlotID}');`;
    const secondSql_query = `UPDATE timeSlots SET filled = true WHERE timeSlotID = '${timeSlotID}';`;

    connection.query(sql_query, function(err, result) {
        if (err) throw err;
        var statement = 'One record inserted';
        console.log(statement);
        // Calling the second query here
        connection.query(secondSql_query, function(err, result) {
          if (err) throw err;
          console.log('Time slot updated');
        });
      });
      res.send(values);
});

app.options('/api/v1/timeslots/:day', function(req, res) {
    // res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).send();
});

// Get all timeslots by the day and id
app.get('/api/v1/timeslots/:day', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    const { day } = req.params;
    const sql_query = `SELECT * FROM timeSlots WHERE day = '${day}';`;
    connection.query(sql_query, function(err, result){
        if(err) throw err;
        var statement = `Timeslot record returned`;
        console.log(statement);
        res.json(result);
    });
});

app.options('/api/v1/timeSlot/clearAll', function(req, res) {
    // res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).send();
});

// Call that will clear all timeslots and appts when activated 
app.delete("/api/v1/timeSlot/clearAll", function (req, res) {
    const sql_query = "DELETE FROM timeSlots";
    const secondSql_query = "DELETE FROM appointments";
  
    connection.query(secondSql_query, function(err, result) {
        if (err) throw err;
        console.log('Appointments Table has been cleared');
        // Calling the second query here
        connection.query(sql_query, function (err, result) {
            if (err) throw err;
        });
        console.log("All items have been deleted from the timeSlots table");      
        res.send("All items have been deleted");
    });

});

app.options('/api/v1/appointments/clearAll', function(req, res) {
    // res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).send();
});

// Call that will only clear all appointments when activated 
app.delete("/api/v1/appointments/clearAll", function (req, res) {
    const secondSql_query = "DELETE FROM appointments";
    const Sql_query = "UPDATE timeSlots SET filled = false";
    
    connection.query(secondSql_query, function(err, result) {
      if (err) throw err;
      console.log("All items have been deleted from the appointments table");
  
      connection.query(Sql_query, function(err, result) {
        if (err) throw err;
        console.log("All filled variables have been set to false in the timeSlots table");
        res.send("All items have been deleted and all filled variables have been set to false");
      });
    });
});
  
  

module.exports = router;
