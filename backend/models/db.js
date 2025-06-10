const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "telemedicine"
});

connection.connect((err) => {
  if (err) {
    console.error("❌ Failed to connect to MySQL:", err);
    throw err;
  }
  console.log("✅ Connected to MySQL");
});

// Create users table (for patients only)
connection.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('patient') NOT NULL,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) console.error("❌ Error creating users table:", err);
  else console.log("✅ Users table ready");
});

// Create pending_users table
connection.query(`
  CREATE TABLE IF NOT EXISTS pending_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('patient', 'doctor') NOT NULL,
    otp VARCHAR(6) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) console.error("❌ Error creating pending_users table:", err);
  else console.log("✅ Pending users table ready");
});

// Create doctors table (for doctors only, no foreign key constraint to users)

  connection.query(`
  CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    specialty VARCHAR(255),
    experience INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) console.error("❌ Error creating doctors table:", err);
  else console.log("✅ Doctors table ready");
});

// Create consultations table
connection.query(`
  CREATE TABLE IF NOT EXISTS consultations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_email VARCHAR(255) NOT NULL,
    doctor_email VARCHAR(255) NOT NULL,
    date DATETIME NOT NULL,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_email) REFERENCES users(email) ON DELETE CASCADE,
    FOREIGN KEY (doctor_email) REFERENCES doctors(email) ON DELETE CASCADE
  )
`, (err) => {
  if (err) console.error("❌ Error creating consultations table:", err);
  else console.log("✅ Consultations table ready");
});

// Promise-based query method
connection.promise = () => {
  return {
    query: (sql, args) => {
      return new Promise((resolve, reject) => {
        connection.query(sql, args, (err, results) => {
          if (err) reject(err);
          else resolve([results, null]);
        });
      });
    }
  };
};

module.exports = connection;