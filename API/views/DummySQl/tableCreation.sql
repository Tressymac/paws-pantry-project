CREATE DATABASE pawsPantry;
USE pawsPantry;

CREATE TABLE admin(
	adminID INT PRIMARY KEY AUTO_INCREMENT,
	firstName VARCHAR(100),
    lastName VARCHAR(100),
    email VARCHAR(100),
    password VARCHAR(100)
);

CREATE TABLE students(
	studentID VARCHAR(10) PRIMARY KEY,
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    email VARCHAR(100)
);

CREATE TABLE timeSlots(
	timeSlotID INT PRIMARY KEY AUTO_INCREMENT,
    day VARCHAR(100),
    time VARCHAR(100),
    filled BOOLEAN
);

CREATE TABLE appointments(
	appointmentID INT PRIMARY KEY AUTO_INCREMENT,
    studentID VARCHAR(10),
    timeSlotID INT,
    CONSTRAINT student_appointment_fk FOREIGN KEY (studentID) REFERENCES students (studentID),
    CONSTRAINT timeSlot_appointment_fk FOREIGN KEY (timeSlotID) REFERENCES timeSlots (timeSlotID)
);