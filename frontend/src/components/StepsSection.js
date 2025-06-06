// components/StepsSection.js
import React from 'react';

const StepsSection = () => (
  <section style={{ padding: '3rem 2rem', backgroundColor: '#f9f9f9' }}>
    <h2>How It Works</h2>
    <ol style={{ marginTop: '1rem', lineHeight: '2rem' }}>
      <li>📅 Book an Appointment</li>
      <li>🩺 Consult with a Doctor via Video</li>
      <li>📄 Receive Your Prescription</li>
    </ol>
  </section>
);

export default StepsSection;
