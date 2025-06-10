import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const User_Dashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [consultations, setConsultations] = useState([]);
  const [pastConsultations, setPastConsultations] = useState([]);
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

  // Fetch doctors and consultations on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch doctors
        const doctorsRes = await axios.get("http://localhost:5000/api/doctors");
        setDoctors(doctorsRes.data);

        // Fetch user's consultations
        const consultationsRes = await axios.get("http://localhost:5000/api/consultations/user", { withCredentials: true });
        setConsultations(consultationsRes.data.filter(c => c.status === "pending" || c.status === "accepted"));
        setPastConsultations(consultationsRes.data.filter(c => c.status === "completed"));
      } catch (err) {
        alert(err.response?.data || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRequestConsultation = async (doctorId) => {
    try {
      const res = await axios.post("http://localhost:5000/api/consultations/request", { doctorId }, { withCredentials: true });
      alert(res.data);
      setConsultations([...consultations, { doctorId, status: "pending", createdAt: new Date() }]);
    } catch (err) {
      alert(err.response?.data || "Failed to request consultation");
    }
  };

  const handleJoinConsultation = (consultationId) => {
    navigate(`/consultation/${consultationId}`);
  };

  const filteredDoctors = specialtyFilter
    ? doctors.filter(doctor => doctor.specialty.toLowerCase() === specialtyFilter.toLowerCase())
    : doctors;

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
          <h2 style={styles.title}>User Dashboard</h2>
        </div>

        {/* Browse Doctors Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Browse Doctors</h3>
          <select
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
            style={styles.input}
          >
            <option value="">All Specialties</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Neurology">Neurology</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Dermatology">Dermatology</option>
          </select>
          {loading ? (
            <p style={styles.loadingText}>Loading doctors...</p>
          ) : (
            filteredDoctors.map(doctor => (
              <div key={doctor.id} style={styles.doctorCard}>
                <div>
                  <p style={styles.doctorName}>Dr. {doctor.name}</p>
                  <p style={styles.doctorSpecialty}>{doctor.specialty}</p>
                </div>
                <button
                  onClick={() => handleRequestConsultation(doctor.id)}
                  style={styles.button}
                >
                  Request Consultation
                </button>
              </div>
            ))
          )}
        </div>

        {/* Ongoing/Pending Consultations */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Ongoing Consultations</h3>
          {consultations.length === 0 ? (
            <p style={styles.noDataText}>No ongoing consultations.</p>
          ) : (
            consultations.map(consultation => (
              <div key={consultation.id} style={styles.consultationCard}>
                <p>Status: {consultation.status}</p>
                {consultation.status === "accepted" && (
                  <button
                    onClick={() => handleJoinConsultation(consultation.id)}
                    style={styles.button}
                  >
                    Join Consultation
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Past Consultations and Prescriptions */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Past Consultations</h3>
          {pastConsultations.length === 0 ? (
            <p style={styles.noDataText}>No past consultations.</p>
          ) : (
            pastConsultations.map(consultation => (
              <div key={consultation.id} style={styles.consultationCard}>
                <p>Completed on: {new Date(consultation.updatedAt).toLocaleDateString()}</p>
                {consultation.prescription && (
                  <p>Prescription: {consultation.prescription}</p>
                )}
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
  input: {
    width: "100%",
    padding: "14px",
    fontSize: "16px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "6px",
    color: "#fff",
    outline: "none",
    marginBottom: "20px",
  },
  doctorCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: "8px",
    marginBottom: "10px",
  },
  doctorName: {
    fontSize: "16px",
    color: "#fff",
  },
  doctorSpecialty: {
    fontSize: "14px",
    color: "#aaa",
  },
  consultationCard: {
    padding: "15px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: "8px",
    marginBottom: "10px",
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
  loadingText: {
    color: "#aaa",
  },
  noDataText: {
    color: "#aaa",
    fontStyle: "italic",
  },
};

export default User_Dashboard;