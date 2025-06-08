const db = require('../models/db');
const { sendOTP } = require('../utils/mailer');

// Generate a 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// REGISTER user
exports.register = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  const otp = generateOtp();

  // Check if user already exists
  const checkSql = "SELECT * FROM users WHERE email = ?";
  db.query(checkSql, [email], (err, results) => {
    if (err) return res.status(500).send("Database error");

    if (results.length > 0) {
      return res.status(400).send("User already exists");
    }

    // Insert new user with OTP
    const insertSql = "INSERT INTO users (email, password, otp, verified) VALUES (?, ?, ?, false)";
    db.query(insertSql, [email, password, otp], (err2) => {
      if (err2) return res.status(500).send("Failed to register user");

      // Send OTP email
      sendOTP(email, otp)
        .then(() => {
          console.log(`OTP sent to ${email}: ${otp}`);
          res.status(200).send("User registered. OTP sent to your email.");
        })
        .catch((emailErr) => {
          console.error("Email error:", emailErr);
          res.status(500).send("User registered but failed to send OTP email");
        });
    });
  });
};

// VERIFY OTP
exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).send("Email and OTP are required");

  const sql = "SELECT otp FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).send("Database error");
    if (results.length === 0) return res.status(404).send("User not found");

    const storedOtp = results[0].otp;
    if (storedOtp === otp) {
      const updateSql = "UPDATE users SET verified = true WHERE email = ?";
      db.query(updateSql, [email], (err2) => {
        if (err2) return res.status(500).send("Verification update failed");
        return res.status(200).send("OTP verified successfully");
      });
    } else {
      return res.status(400).send("Incorrect OTP");
    }
  });
};
