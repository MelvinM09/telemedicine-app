const db = require('../models/db');
const { sendOTP } = require('../utils/mailer');
const bcrypt = require('bcrypt');

// Generate a 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// REGISTER user (store temporarily)
exports.register = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  try {
    const checkSql = "SELECT email FROM users WHERE email = ? UNION SELECT email FROM pending_users WHERE email = ?";
    const [results] = await db.promise().query(checkSql, [email, email]);

    if (results.length > 0) {
      return res.status(400).send("User already exists or registration pending");
    }

    const otp = generateOtp();
    const hashedPassword = await bcrypt.hash(password, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const insertSql = "INSERT INTO pending_users (email, password, otp, expires_at) VALUES (?, ?, ?, ?)";
    await db.promise().query(insertSql, [email, hashedPassword, otp, expiresAt]);

    await sendOTP(email, otp);
    console.log(`OTP sent to ${email}: ${otp}`);
    res.status(200).send("OTP sent to your email. Please verify to complete registration.");
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).send("Failed to initiate registration: " + err.message);
  }
};

// VERIFY OTP and complete registration
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).send("Email and OTP are required");

  try {
    const sql = "SELECT * FROM pending_users WHERE email = ? AND otp = ? AND expires_at > NOW()";
    const [results] = await db.promise().query(sql, [email, otp]);

    if (results.length === 0) {
      return res.status(400).send("Invalid or expired OTP");
    }

    const { password } = results[0];

    const insertUserSql = "INSERT INTO users (email, password, verified) VALUES (?, ?, true)";
    await db.promise().query(insertUserSql, [email, password]);

    const deletePendingSql = "DELETE FROM pending_users WHERE email = ?";
    await db.promise().query(deletePendingSql, [email]);

    res.status(200).send("Registration completed successfully");
  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).send("Verification failed");
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).send("Email and password are required");

  try {
    console.log('Login attempt for email:', email);
    const sql = "SELECT * FROM users WHERE email = ? AND verified = true";
    console.log('Executing query:', sql, [email]);
    const [results] = await db.promise().query(sql, [email]);
    console.log('Query results:', results);

    if (results.length === 0) return res.status(401).send("Invalid credentials or unverified account");

    const user = results[0];
    console.log('User found:', user);
    const match = await bcrypt.compare(password, user.password);
    console.log('Password match:', match);
    if (!match) return res.status(401).send("Invalid credentials");

    // Check if req.session is available
    if (!req.session) {
      console.error('Session middleware not initialized');
      return res.status(500).send("Session middleware not initialized");
    }

    console.log('Setting session:', { userId: user.id, email: user.email });
    req.session.userId = user.id;
    req.session.email = user.email;
    console.log('Session set successfully');
    res.status(200).send("Login successful");
  } catch (err) {
    console.error("Login error details:", err.stack);
    res.status(500).send("Login failed: " + err.message);
  }
};

// LOGOUT
exports.logout = (req, res) => {
  if (!req.session) {
    return res.status(400).send("No session found");
  }
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).send("Logout failed");
    }
    res.clearCookie('connect.sid');
    res.status(200).send("Logout successful");
  });
};