-- สร้างฐานข้อมูล (ใช้ของเดิมหากมีอยู่แล้ว)
CREATE DATABASE IF NOT EXISTS dit205_db;
USE dit205_db;

-- สร้างตาราง users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  fullname VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
