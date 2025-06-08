import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  // Array of services
  const services = [
    'General Medicine',
    'Dermatology',
    'Pediatrics',
    'Psychiatry',
    'Gynecology',
    'Cardiology',
    'ENT',
    'Orthopedics',
  ];

  return (
    <div className="hero-section">
      <video autoPlay loop muted playsInline className="background-video">
        <source src="/background-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="hero-content">
        <h1>Access Healthcare Anytime, Anywhere</h1>
        <p>Connect with certified doctors through secure video consultations</p>
        <button className="cta-button">Book Now</button>
      </div>
      <div className="services-marquee">
        <div className="services-track">
          {/* Render services twice for seamless looping */}
          {services.map((service, index) => (
            <div key={`service-${index}`} className="service-item">
              {service}
            </div>
          ))}
          {services.map((service, index) => (
            <div key={`service-duplicate-${index}`} className="service-item">
              {service}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;