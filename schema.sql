CREATE DATABASE IF NOT EXISTS placement_db;
USE placement_db;


CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  branch VARCHAR(50) NOT NULL,
  cgpa DECIMAL(4,2),
  email VARCHAR(100),
  phone VARCHAR(15),
  status ENUM('available', 'applied', 'shortlisted') DEFAULT 'available',
  applied_company VARCHAR(100) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE companies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  domain VARCHAR(100),
  package DECIMAL(10,2),
  openings INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE placements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_name VARCHAR(100) NOT NULL,
  branch VARCHAR(50),
  email VARCHAR(100),
  phone VARCHAR(15),
  cgpa DECIMAL(4,2),
  company_name VARCHAR(100) NOT NULL,
  package DECIMAL(10,2),
  placed_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO students (name, branch, cgpa, email, phone, status) VALUES
('Rahul Sharma', 'CSE', 8.5, 'rahul@example.com', '9876543210', 'available'),
('Priya Patel', 'IT', 7.9, 'priya@example.com', '9876543211', 'applied'),
('Amit Singh', 'ECE', 8.1, 'amit@example.com', '9876543212', 'shortlisted'),
('Sneha Verma', 'CSE', 9.2, 'sneha@example.com', '9876543213', 'available'),
('Rohan Gupta', 'MECH', 7.5, 'rohan@example.com', '9876543214', 'available');

INSERT INTO companies (name, domain, package, openings) VALUES
('TCS', 'IT Services', 3.5, 10),
('Infosys', 'IT Services', 4.0, 8),
('Google', 'Product', 25.0, 2),
('Wipro', 'IT Services', 3.8, 6),
('Amazon', 'E-Commerce', 18.0, 3);

INSERT INTO placements (student_name, branch, email, phone, cgpa, company_name, package) VALUES
('Vikram Nair', 'CSE', 'vikram@example.com', '9876543215', 8.8, 'Google', 25.0),
('Ananya Joshi', 'IT', 'ananya@example.com', '9876543216', 8.3, 'Amazon', 18.0);
