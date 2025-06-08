import React from 'react';
import './CTSection.css';

const CTSection = () => {
  // Array of features for the telemedicine app
  const features = [
    '24/7 Consultations',
    'Secure Video Calls',
    'Certified Doctors',
    'Instant Prescriptions',
    'Medical Records Access',
    'Appointment Scheduling',
    'Multi-Specialty Care',
    'Confidential Support',
  ];

  return (
    <div className="features-section">
      <h2>Our Features</h2>
      <div className="features-list">
        {features.map((feature, index) => (
          <div key={`feature-${index}`} className="feature-item">
            {feature}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CTSection;