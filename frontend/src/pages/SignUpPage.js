import React, { useState } from "react";
import axios from "axios";

const SignUpPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

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

  return (
    <div style={{ padding: "2rem" }}>
      {step === 1 && (
        <>
          <h2>Sign Up</h2>
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <br />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          <br />
          <button onClick={handleRegister}>Register</button>
        </>
      )}

      {step === 2 && (
        <>
          <h2>Enter OTP</h2>
          <p>Check your email for the OTP</p>
          <input type="text" placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)} />
          <br />
          <button onClick={handleVerifyOtp}>Verify OTP</button>
        </>
      )}

      {step === 3 && (
        <h2>Registration Complete 🎉</h2>
      )}
    </div>
  );
};

export default SignUpPage;
