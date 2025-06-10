import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient"); // Default role as patient
  const [otp, setOtp] = useState("");
  const [balls, setBalls] = useState([]);
  const navigate = useNavigate();

  // Initialize balls
  useEffect(() => {
    const initialBalls = Array.from({ length: 100 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 50,
      size: 0.5 + Math.random() * 1,
      speedX: (Math.random() - 0.5) * 0.1,
      speedY: (Math.random() - 0.5) * 0.1,
    }));
    setBalls(initialBalls);
  }, []);

  // Animate balls
  useEffect(() => {
    if (balls.length === 0) return;

    const interval = setInterval(() => {
      setBalls(prevBalls =>
        prevBalls.map(ball => {
          let newX = ball.x + ball.speedX;
          let newY = ball.y + ball.speedY;
          let newSpeedX = ball.speedX;
          let newSpeedY = ball.speedY;

          if (newX <= 0 || newX >= 100) newSpeedX *= -1;
          if (newY <= 0 || newY >= 50) newSpeedY *= -1;

          return {
            ...ball,
            x: Math.max(0, Math.min(100, newX)),
            y: Math.max(0, Math.min(50, newY)),
            speedX: newSpeedX,
            speedY: newSpeedY,
          };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [balls]);

  const handleRegister = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", { email, password, role });
      alert(res.data); // Show the exact message from the backend
      setStep(2); // Move to OTP input step
    } catch (err) {
      const errorMessage = err.response?.data || "An unexpected error occurred during registration";
      alert(errorMessage); // Show the exact error message from the backend
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp });
      alert(res.data); // Show the exact message from the backend
      setStep(3); // Show registration complete message
      setTimeout(() => {
        navigate(role === "doctor" ? "/doctor-dashboard" : "/user-dashboard");
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data || "An unexpected error occurred during OTP verification";
      alert(errorMessage); // Show the exact error message from the backend
    }
  };

  const handleSignInNavigation = () => {
    navigate("/signin");
  };

  return (
    <div style={styles.background}>
      <div style={styles.gradientSemiCircle}>
        {balls.map((ball, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: `${ball.x}%`,
              top: `${ball.y}%`,
              width: `${ball.size}px`,
              height: `${ball.size}px`,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '50%',
            }}
          />
        ))}
      </div>

      <div style={styles.container}>
        <div style={styles.logo}>Telemedicine</div>
        <div style={styles.tagline}>Treat Yourself from your home.</div>

        {step === 1 && (
          <>
            <div style={styles.formContainer}>
              <h2 style={styles.signInText}>Sign Up</h2>
              <div style={styles.formGroup}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={styles.input}
                >
                  <option value="patient">Register as Patient</option>
                  <option value="doctor">Register as Doctor</option>
                </select>
              </div>
              <button onClick={handleRegister} style={styles.button}>
                Register
              </button>
            </div>
            <div style={styles.signInPrompt}>
              <span style={styles.signInText}>Already have an account?</span>
              <button onClick={handleSignInNavigation} style={styles.signInButton}>
                SIGN IN NOW
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <div style={styles.formContainer}>
            <h2 style={styles.signInText}>Enter OTP</h2>
            <p style={styles.subText}>Check your email for the OTP</p>
            <div style={styles.formGroup}>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={styles.input}
              />
            </div>
            <button onClick={handleVerifyOtp} style={styles.button}>
              Verify OTP
            </button>
          </div>
        )}

        {step === 3 && (
          <div style={styles.successContainer}>
            <h2 style={styles.successText}>Registration Complete 🎉</h2>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  background: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#000",
    position: 'relative',
    overflow: 'hidden',
  },
  gradientSemiCircle: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '150vw',
    height: '80vh',
    background: 'radial-gradient(ellipse at center top, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.08) 30%, transparent 70%)',
    zIndex: 0,
  },
  container: {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "rgba(20, 20, 20, 0.9)",
    borderRadius: "12px",
    padding: "40px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
    color: "#fff",
    textAlign: "center",
    position: 'relative',
    zIndex: 1,
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    marginTop: "40px",
  },
  logo: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "8px",
    background: "linear-gradient(90deg, #fff, #aaa)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  tagline: {
    fontSize: "16px",
    color: "#aaa",
    marginBottom: "30px",
  },
  formContainer: {
    marginBottom: "30px",
  },
  signInText: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#fff",
  },
  subText: {
    fontSize: "14px",
    color: "#aaa",
  },
  formGroup: {
    marginBottom: "20px",
    textAlign: "left",
  },
  input: {
    width: "100%",
    padding: "14px",
    fontSize: "16px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "6px",
    color: "#fff",
    outline: "none",
    transition: "border 0.3s",
  },
  button: {
    width: "100%",
    padding: "14px",
    fontSize: "16px",
    fontWeight: "bold",
    backgroundColor: "#fff",
    color: "#000",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    marginTop: "10px",
  },
  signInPrompt: {
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    paddingTop: "20px",
  },
  signInButton: {
    width: "100%",
    padding: "12px",
    fontSize: "14px",
    fontWeight: "bold",
    backgroundColor: "transparent",
    color: "#fff",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.3s",
  },
  successContainer: {
    padding: "20px",
  },
  successText: {
    color: "#fff",
    fontSize: "24px",
  },
};

export default SignUpPage;