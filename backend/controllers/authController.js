const db = require('../models/db');
const { sendOTP } = require('../utils/mailer');
const bcrypt = require('bcrypt');

// Generate 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// REGISTER
exports.register = async (req, res) => {
  const { email, password, role } = req.body;
  const timestamp = new Date().toISOString();

  if (!email || !password || !role) {
    console.log(`[${timestamp}] Registration failed: Missing email, password, or role`);
    return res.status(400).send("Email, password, and role are required");
  }

  try {
    if (role.toLowerCase().trim() === 'doctor') {
      const [existingDoctor] = await db.promise().query("SELECT * FROM doctors WHERE email = ?", [email]);
      if (existingDoctor.length > 0) {
        console.log(`[${timestamp}] Registration blocked: ${email} is already registered as a doctor`);
        return res.status(400).send("Doctor already exists. Please log in.");
      }
    } else {
      const [existingUser] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
      if (existingUser.length > 0) {
        if (existingUser[0].verified) {
          console.log(`[${timestamp}] Registration blocked: ${email} is already verified`);
          return res.status(400).send("User already exists and is verified. Please log in.");
        } else {
          console.log(`[${timestamp}] Registration blocked: ${email} exists but is not verified`);
          return res.status(400).send("User exists but is not verified. Please contact support.");
        }
      }
    }

    const [pendingUser] = await db.promise().query("SELECT * FROM pending_users WHERE email = ?", [email]);
    if (pendingUser.length > 0) {
      await db.promise().query("DELETE FROM pending_users WHERE email = ?", [email]);
      console.log(`[${timestamp}] Removed existing pending user entry for ${email}`);
    }

    const otp = generateOtp();
    const hashedPassword = await bcrypt.hash(password, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await db.promise().query(
      "INSERT INTO pending_users (email, password, otp, expires_at, role) VALUES (?, ?, ?, ?, ?)",
      [email, hashedPassword, otp, expiresAt, role]
    );

    console.log(`[${timestamp}] Pending user created: ${email} with OTP ${otp}`);

    try {
      await sendOTP(email, otp);
      console.log(`[${timestamp}] OTP sent to ${email}`);
      res.status(200).send("OTP sent to your email. Please verify to complete registration.");
    } catch (emailError) {
      console.error(`[${timestamp}] Failed to send OTP:`, emailError.message);
      await db.promise().query("DELETE FROM pending_users WHERE email = ?", [email]);
      return res.status(500).send("Failed to send OTP. Please try again.");
    }

  } catch (err) {
    console.error(`[${timestamp}] Registration error:`, err.message);
    res.status(500).send("Failed to initiate registration: " + err.message);
  }
};

// VERIFY OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const timestamp = new Date().toISOString();

  if (!email || !otp) {
    console.log(`[${timestamp}] OTP verification failed: Missing fields`);
    return res.status(400).send("Email and OTP are required");
  }

  let connection;
  try {
    const [userInUsers] = await db.promise().query("SELECT * FROM users WHERE email = ? AND verified = true", [email]);
    const [userInDoctors] = await db.promise().query("SELECT * FROM doctors WHERE email = ?", [email]);
    if (userInUsers.length > 0 || userInDoctors.length > 0) {
      return res.status(400).send("User or doctor already registered.");
    }

    const [results] = await db.promise().query(
      "SELECT * FROM pending_users WHERE email = ? AND otp = ? AND expires_at > NOW()",
      [email, otp]
    );

    if (results.length === 0) {
      return res.status(400).send("Invalid or expired OTP");
    }

    const { password, role } = results[0];
    const normalizedRole = role.toLowerCase().trim();

    connection = await db.promise();
    await connection.query("START TRANSACTION");

    if (normalizedRole === 'doctor') {
      await connection.query(
        "INSERT INTO doctors (email, password, role) VALUES (?, ?, 'doctor')",
        [email, password]
      );
      console.log(`[${timestamp}] Doctor registered: ${email}`);
    } else {
      await connection.query(
        "INSERT INTO users (email, password, role, verified) VALUES (?, ?, 'patient', true)",
        [email, password]
      );
      console.log(`[${timestamp}] Patient registered: ${email}`);
    }

    await connection.query("DELETE FROM pending_users WHERE email = ?", [email]);
    await connection.query("COMMIT");

    res.status(200).send("Registration completed successfully");
  } catch (err) {
    if (connection) await connection.query("ROLLBACK");
    console.error(`[${timestamp}] OTP verification error:`, err.message);
    res.status(500).send("Verification failed: " + err.message);
  }
};

// LOGIN (UPDATED)
exports.login = async (req, res) => {
  const { email, password, role } = req.body;
  const timestamp = new Date().toISOString();

  if (!email || !password || !role) {
    return res.status(400).send("Email, password, and role are required");
  }

  try {
    let user;
    const normalizedRole = role.toLowerCase().trim();

    if (normalizedRole === 'doctor') {
      const [results] = await db.promise().query("SELECT * FROM doctors WHERE email = ?", [email]);
      if (results.length === 0) {
        return res.status(401).send("Doctor not found");
      }
      user = results[0];
    } else {
      const [results] = await db.promise().query(
        "SELECT * FROM users WHERE email = ? AND role = 'patient' AND verified = true",
        [email]
      );
      if (results.length === 0) {
        return res.status(401).send("Patient not found or unverified");
      }
      user = results[0];
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).send("Invalid credentials");
    }

    req.session.userId = user.id;
    req.session.email = user.email;
    req.session.role = normalizedRole;

    console.log(`[${timestamp}] ${normalizedRole} ${email} logged in`);

    // ✅ Return role and userId for frontend
    res.status(200).json({
      message: "Login successful",
      role: normalizedRole,
      userId: user.id
    });
  } catch (err) {
    console.error(`[${timestamp}] Login error:`, err.message);
    res.status(500).send("Login failed: " + err.message);
  }
};

// LOGOUT
exports.logout = (req, res) => {
  const timestamp = new Date().toISOString();

  if (!req.session) {
    return res.status(400).send("No session found");
  }

  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Logout failed");
    }
    res.clearCookie('connect.sid');
    console.log(`[${timestamp}] User logged out`);
    res.status(200).send("Logout successful");
  });
};
