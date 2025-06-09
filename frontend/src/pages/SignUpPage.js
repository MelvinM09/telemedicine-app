import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [balls, setBalls] = useState([]);
  const navigate = useNavigate();

  // Initialize balls
  useEffect(() => {
    const initialBalls = Array.from({ length: 100 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 50,
      size: 0.5 + Math.random() * 1, // Tiny balls: 0.5px to 1.5px
      speedX: (Math.random() - 0.5) * 0.1, // Speed range: -0.05 to 0.05
      speedY: (Math.random() - 0.5) * 0.1, // Speed range: -0.05 to 0.05
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

          // Bounce off edges
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
    }, 50); // 50ms interval for smooth, slow animation

    return () => clearInterval(interval);
  }, [balls]);

  const handleRegister = async () => {
    console.log("Register button clicked");
    console.log("Registering with:", { email, password });

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", { email, password });
      alert(res.data);
      setStep(2); // Show OTP input
    } catch (err) {
      alert(err.response?.data || "Registration failed");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp });
      alert(res.data);
      setStep(3); // Completed
    } catch (err) {
      alert(err.response?.data || "OTP verification failed");
    }
  };

  const handleSignInNavigation = () => {
    navigate("/signin"); // Navigate to the SignInPage
  };

  return (
    <div style={styles.background}>
      {/* Animated semi-circle with moving balls */}
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
    display: "block",
    
  },
  subText: {
    fontSize: "14px",
    color: "#aaa",
    marginBottom: "20px",
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
    '&:focus': {
      borderColor: 'rgba(210, 180, 140, 0.5)',
    }
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
    '&:hover': {
      backgroundColor: "#eee",
    }
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
    '&:hover': {
      borderColor: 'rgba(210, 180, 140, 0.5)',
      color: 'rgba(210, 180, 140, 1)',
    }
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