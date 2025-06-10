const db = require('../models/db');
const { sendOTP } = require('../utils/mailer');
const bcrypt = require('bcrypt');

// Generate 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// REGISTER user
exports.register = async (req, res) => {
  const { email, password, role } = req.body;
  const timestamp = new Date().toISOString();

  if (!email || !password || !role) {
    console.log(`[${timestamp}] Registration failed: Missing email, password, or role`);
    return res.status(400).send("Email, password, and role are required");
  }

  try {
    // Step 1: Check if the user already exists in the appropriate table
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

    // Step 2: Delete any existing pending user entry (no blocking)
    const [pendingUser] = await db.promise().query("SELECT * FROM pending_users WHERE email = ?", [email]);
    if (pendingUser.length > 0) {
      await db.promise().query("DELETE FROM pending_users WHERE email = ?", [email]);
      console.log(`[${timestamp}] Removed existing pending user entry for ${email}`);
    }

    // Step 3: Create a new pending user
    const otp = generateOtp();
    const hashedPassword = await bcrypt.hash(password, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    const insertSql = "INSERT INTO pending_users (email, password, otp, expires_at, role) VALUES (?, ?, ?, ?, ?)";
    await db.promise().query(insertSql, [email, hashedPassword, otp, expiresAt, role]);
    console.log(`[${timestamp}] Pending user created: ${email} with OTP ${otp}, expires at ${expiresAt.toISOString()}`);

    // Step 4: Send the OTP
    try {
      await sendOTP(email, otp);
      console.log(`[${timestamp}] OTP ${otp} sent successfully to ${email}`);
      res.status(200).send("OTP sent to your email. Please verify to complete registration.");
    } catch (emailError) {
      console.error(`[${timestamp}] Failed to send OTP to ${email}:`, emailError.message);
      // Rollback: Remove the pending user if email fails
      await db.promise().query("DELETE FROM pending_users WHERE email = ?", [email]);
      console.log(`[${timestamp}] Rolled back pending user ${email} due to email sending failure`);
      return res.status(500).send("Failed to send OTP. Please try again.");
    }
  } catch (err) {
    console.error(`[${timestamp}] Registration error for ${email}:`, err.message);
    res.status(500).send("Failed to initiate registration: " + err.message);
  }
};

// VERIFY OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const timestamp = new Date().toISOString();

  if (!email || !otp) {
    console.log(`[${timestamp}] OTP verification failed: Missing email or OTP`);
    return res.status(400).send("Email and OTP are required");
  }

  let connection;
  try {
    // Step 1: Check if user is already verified
    const [userInUsers] = await db.promise().query("SELECT * FROM users WHERE email = ? AND verified = true", [email]);
    const [userInDoctors] = await db.promise().query("SELECT * FROM doctors WHERE email = ?", [email]);
    if (userInUsers.length > 0 || userInDoctors.length > 0) {
      console.log(`[${timestamp}] OTP verification blocked: ${email} is already registered`);
      return res.status(400).send("User or doctor is already registered. Please log in.");
    }

    // Step 2: Check the OTP in pending_users
    const sql = "SELECT * FROM pending_users WHERE email = ? AND otp = ? AND expires_at > NOW()";
    const [results] = await db.promise().query(sql, [email, otp]);

    if (results.length === 0) {
      console.log(`[${timestamp}] OTP verification failed for ${email}: Invalid or expired OTP ${otp}`);
      return res.status(400).send("Invalid or expired OTP");
    }

    const { password, role } = results[0];
    if (!password) {
      console.error(`[${timestamp}] OTP verification failed for ${email}: Password is missing in pending_users`);
      return res.status(500).send("Internal server error: Missing password data in pending_users");
    }

    // Log the role value for debugging
    console.log(`[${timestamp}] Role retrieved from pending_users for ${email}: "${role}"`);

    // Step 3: Start a transaction
    connection = await db.promise();
    await connection.query("START TRANSACTION");

    // Step 4: Handle registration based on role
    const normalizedRole = role ? role.toLowerCase().trim() : '';
    if (normalizedRole === 'doctor') {
      console.log(`[${timestamp}] Role is doctor, inserting ${email} into doctors table`);
      try {
        const insertDoctorSql = "INSERT INTO doctors (email) VALUES (?)";
        await connection.query(insertDoctorSql, [email]);
        console.log(`[${timestamp}] User ${email} added to doctors table`);
      } catch (doctorError) {
        console.error(`[${timestamp}] Failed to insert ${email} into doctors table:`, doctorError.message);
        throw doctorError; // Re-throw to trigger rollback
      }
    } else {
      console.log(`[${timestamp}] Role is patient, inserting into users table`);
      const insertUserSql = "INSERT INTO users (email, password, role, verified) VALUES (?, ?, ?, true)";
      await connection.query(insertUserSql, [email, password, 'patient']);
      console.log(`[${timestamp}] User ${email} added to users table with role patient`);
    }

    // Step 5: Remove from pending_users
    const deletePendingSql = "DELETE FROM pending_users WHERE email = ?";
    await connection.query(deletePendingSql, [email]);
    console.log(`[${timestamp}] Removed ${email} from pending_users`);

    // Step 6: Commit the transaction
    await connection.query("COMMIT");
    console.log(`[${timestamp}] User ${email} verified successfully with OTP ${otp}`);
    res.status(200).send("Registration completed successfully");
  } catch (err) {
    console.error(`[${timestamp}] OTP verification error for ${email}:`, err.message);
    if (connection) {
      await connection.query("ROLLBACK");
      console.log(`[${timestamp}] Rolled back transaction for ${email}`);
    }
    res.status(500).send("Verification failed: " + err.message);
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password, role } = req.body;
  const timestamp = new Date().toISOString();

  if (!email || !password || !role) {
    console.log(`[${timestamp}] Login failed: Missing email, password, or role`);
    return res.status(400).send("Email, password, and role are required");
  }

  try {
    let user;
    const normalizedRole = role.toLowerCase().trim();
    if (normalizedRole === 'doctor') {
      const [results] = await db.promise().query("SELECT * FROM pending_users WHERE email = ? AND role = 'doctor'", [email]);
      if (results.length === 0) {
        console.log(`[${timestamp}] Login failed for ${email}: Doctor not found`);
        return res.status(401).send("Invalid credentials");
      }
      user = results[0];
    } else {
      const [results] = await db.promise().query("SELECT * FROM users WHERE email = ? AND role = 'patient' AND verified = true", [email]);
      if (results.length === 0) {
        console.log(`[${timestamp}] Login failed for ${email}: Patient not found or unverified account`);
        return res.status(401).send("Invalid credentials or unverified account");
      }
      user = results[0];
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log(`[${timestamp}] Login failed for ${email}: Incorrect password`);
      return res.status(401).send("Invalid credentials");
    }

    req.session.userId = user.id;
    req.session.email = user.email;
    req.session.role = normalizedRole;
    console.log(`[${timestamp}] User ${email} logged in successfully as ${normalizedRole}`);
    res.status(200).send("Login successful");
  } catch (err) {
    console.error(`[${timestamp}] Login error for ${email}:`, err.message);
    res.status(500).send("Login failed: " + err.message);
  }
};

// LOGOUT
exports.logout = (req, res) => {
  const timestamp = new Date().toISOString();

  if (!req.session) {
    console.log(`[${timestamp}] Logout failed: No session found`);
    return res.status(400).send("No session found");
  }

  req.session.destroy((err) => {
    if (err) {
      console.error(`[${timestamp}] Logout error:`, err.message);
      return res.status(500).send("Logout failed");
    }
    res.clearCookie('connect.sid');
    console.log(`[${timestamp}] User logged out successfully`);
    res.status(200).send("Logout successful");
  });
};