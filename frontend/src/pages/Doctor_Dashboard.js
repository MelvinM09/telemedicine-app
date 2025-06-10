import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Doctor_Dashboard = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [acceptedConsultations, setAcceptedConsultations] = useState([]);
  const [prescription, setPrescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [balls, setBalls] = useState([]);
  const navigate = useNavigate();

  // Initialize balls for background animation
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

  // Fetch consultations on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/consultations/doctor", { withCredentials: true });
        setPendingRequests(res.data.filter(c => c.status === "pending"));
        setAcceptedConsultations(res.data.filter(c => c.status === "accepted"));
      } catch (err) {
        alert(err.response?.data || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAcceptRequest = async (consultationId) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/consultations/${consultationId}/accept`, {}, { withCredentials: true });
      alert(res.data);
      setPendingRequests(pendingRequests.filter(c => c.id !== consultationId));
      setAcceptedConsultations([...acceptedConsultations, { id: consultationId, status: "accepted" }]);
    } catch (err) {
      alert(err.response?.data || "Failed to accept request");
    }
  };

  const handleDeclineRequest = async (consultationId) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/consultations/${consultationId}/decline`, {}, { withCredentials: true });
      alert(res.data);
      setPendingRequests(pendingRequests.filter(c => c.id !== consultationId));
    } catch (err) {
      alert(err.response?.data || "Failed to decline request");
    }
  };

  const handleJoinConsultation = (consultationId) => {
    navigate(`/consultation/${consultationId}`);
  };

  const handleSubmitPrescription = async (consultationId) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/consultations/${consultationId}/prescription`, { prescription }, { withCredentials: true });
      alert(res.data);
      setAcceptedConsultations(acceptedConsultations.filter(c => c.id !== consultationId));
      setPrescription("");
    } catch (err) {
      alert(err.response?.data || "Failed to submit prescription");
    }
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
        <div style={styles.header}>
          <h2 style={styles.title}>Doctor Dashboard</h2>
        </div>

        {/* Pending Requests */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Pending Requests</h3>
          {loading ? (
            <p style={styles.loadingText}>Loading requests...</p>
          ) : pendingRequests.length === 0 ? (
            <p style={styles.noDataText}>No pending requests.</p>
          ) : (
            pendingRequests.map(request => (
              <div key={request.id} style={styles.requestCard}>
                <p>Patient ID: {request.userId}</p>
                <p>Requested on: {new Date(request.createdAt).toLocaleDateString()}</p>
                <div style={styles.buttonGroup}>
                  <button
                    onClick={() => handleAcceptRequest(request.id)}
                    style={{ ...styles.button, backgroundColor: "#4CAF50", color: "#fff" }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleDeclineRequest(request.id)}
                    style={{ ...styles.button, backgroundColor: "#f44336", color: "#fff" }}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Accepted Consultations */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Accepted Consultations</h3>
          {acceptedConsultations.length === 0 ? (
            <p style={styles.noDataText}>No accepted consultations.</p>
          ) : (
            acceptedConsultations.map(consultation => (
              <div key={consultation.id} style={styles.consultationCard}>
                <p>Patient ID: {consultation.userId}</p>
                <button
                  onClick={() => handleJoinConsultation(consultation.id)}
                  style={styles.button}
                >
                  Join Consultation
                </button>
                <div style={styles.prescriptionForm}>
                  <input
                    type="text"
                    placeholder="Enter prescription"
                    value={prescription}
                    onChange={(e) => setPrescription(e.target.value)}
                    style={styles.input}
                  />
                  <button
                    onClick={() => handleSubmitPrescription(consultation.id)}
                    style={styles.button}
                  >
                    Submit Prescription
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
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
    maxWidth: "800px",
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
  header: {
    marginBottom: "30px",
  },
  title: {
    fontSize: "28px",
    color: "#fff",
  },
  section: {
    marginBottom: "40px",
    textAlign: "left",
  },
  sectionTitle: {
    fontSize: "20px",
    color: "#fff",
    marginBottom: "15px",
  },
  requestCard: {
    padding: "15px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: "8px",
    marginBottom: "10px",
  },
  consultationCard: {
    padding: "15px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: "8px",
    marginBottom: "10px",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: "bold",
    backgroundColor: "#fff",
    color: "#000",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    '&:hover': {
      backgroundColor: "#eee",
    },
  },
  prescriptionForm: {
    marginTop: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
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
  },
  loadingText: {
    color: "#aaa",
  },
  noDataText: {
    color: "#aaa",
    fontStyle: "italic",
  },
};

export default Doctor_Dashboard;