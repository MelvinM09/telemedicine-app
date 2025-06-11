import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

const SignInPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [balls, setBalls] = useState([]);
  const navigate = useNavigate();

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

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please provide both email and password");
      return;
    }

    setLoading(true);
    setError("");

    let role = null;

    try {
      // Attempt doctor login
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
        role: "doctor",
      });
      console.log("Doctor login response:", res.data);
      role = res.data.role?.toLowerCase();
    } catch (err) {
      // Fallback to patient login
      if (err.response?.status === 401 || err.response?.status === 400) {
        try {
          const res = await axios.post("http://localhost:5000/api/auth/login", {
            email,
            password,
            role: "patient",
          });
          console.log("Patient login response:", res.data);
          role = res.data.role?.toLowerCase();
        } catch (patientErr) {
          console.error("Login error (patient):", patientErr);
          setError(patientErr.response?.data?.message || "Login failed. Please try again.");
          setLoading(false);
          return;
        }
      } else {
        console.error("Login error (doctor):", err);
        setError(err.response?.data?.message || "Login failed. Please try again.");
        setLoading(false);
        return;
      }
    }

    if (!role) {
      setError("Login succeeded, but role not provided. Contact support.");
      setLoading(false);
      return;
    }

    setStep(2);

    setTimeout(() => {
      if (role === "doctor") {
        navigate("/doctor-dashboard");
      } else if (role === "patient") {
        navigate("/user-dashboard");
      } else {
        setError("Unknown role. Please contact support.");
      }
    }, 2000);

    setLoading(false);
  };

  const handleSignUpNavigation = () => {
    navigate("/signup");
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
              <h2 style={styles.signInText}>Sign In</h2>
              {error && <div style={styles.errorText}>{error}</div>}
              <div style={styles.formGroup}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  disabled={loading}
                />
              </div>
              <div style={styles.formGroup}>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  disabled={loading}
                />
              </div>
              <button onClick={handleLogin} style={styles.button} disabled={loading}>
                {loading ? "Logging in..." : "Sign In"}
              </button>
            </div>
            <div style={styles.signUpPrompt}>
              <span style={styles.signUpText}>Book For a Doctor Now.</span>
              <button onClick={handleSignUpNavigation} style={styles.signUpButton}>
                SIGN UP NOW
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <div style={styles.successContainer}>
            <h2 style={styles.successText}>Login Successful 🎉</h2>
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
  signUpPrompt: {
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    paddingTop: "20px",
  },
  signUpText: {
    display: "block",
    fontSize: "14px",
    color: "#aaa",
    marginBottom: "15px",
  },
  signUpButton: {
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
  errorText: {
    color: "#ff4d4d",
    fontSize: "14px",
    marginBottom: "15px",
    textAlign: "center",
  },
};

export default SignInPage;
