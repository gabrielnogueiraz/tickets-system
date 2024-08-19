CREATE DATABASE cercred_helpdesk;

USE cercred_helpdesk;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100),
    service VARCHAR(255),
    description TEXT,   
    deskNumber VARCHAR(10),
    employeeId VARCHAR(10),
    status VARCHAR(50),
    techName VARCHAR(100),
    dateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);