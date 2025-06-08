import React from 'react';
import './StepsSection.css';

const StepsSection = () => {
  const steps = [
    { icon: '📅', text: 'Book an Appointment' },
    { icon: '🩺', text: 'Consult with a Doctor via Video' },
    { icon: '📄', text: 'Receive Your Prescription' },
  ];

  return (
    <section className="steps-section">
      <h2>How It Works</h2>
      <div className="steps-list">
        {steps.map((step, index) => (
          <div key={`step-${index}`} className="step-item">
            <span className="step-icon">{step.icon}</span>
            <p>{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StepsSection;