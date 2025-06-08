import React, { useState, useEffect, useRef } from 'react';
import './CarouselSection.css';

const CarouselSection = () => {
  const slides = [
    {
      image: 'https://familydoctor.org/wp-content/uploads/2018/02/41808433_l.jpg',
      title: 'Expert Telemedicine Care',
      description: 'Connect with certified doctors anytime, anywhere.',
    },
    {
      image: 'https://s3-eu-west-1.amazonaws.com/intercare-web-public/wysiwyg-uploads%2F1698752331464-pexels-tessy-agbonome-18828741-min.jpg',
      title: 'Secure Video Consultations',
      description: 'Safe and private video calls for your health needs.',
    },
    {
      image: 'https://hips.hearstapps.com/hmg-prod/images/portrait-of-a-happy-young-doctor-in-his-clinic-royalty-free-image-1661432441.jpg',
      title: 'Instant Prescriptions',
      description: 'Get prescriptions and advice in minutes.',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const timeoutRef = useRef(null);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => {
        if (prevSlide === slides.length - 1) {
          // When on the last slide, disable transition for instant reset to first slide
          setIsTransitioning(false);
          setTimeout(() => {
            setIsTransitioning(true); // Re-enable transition after reset
          }, 0);
          return 0; // Reset to first slide
        }
        return (prevSlide + 1) % slides.length;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // Navigate to previous slide
  const goToPrevious = () => {
    setIsTransitioning(true); // Ensure transition is enabled for manual navigation
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };

  // Navigate to next slide
  const goToNext = () => {
    setIsTransitioning(true); // Ensure transition is enabled for manual navigation
    setCurrentSlide((prevSlide) => {
      if (prevSlide === slides.length - 1) {
        setIsTransitioning(false); // Disable transition for instant reset
        setTimeout(() => {
          setIsTransitioning(true); // Re-enable transition after reset
        }, 0);
        return 0; // Reset to first slide
      }
      return (prevSlide + 1) % slides.length;
    });
  };

  // Handle dot click
  const goToSlide = (index) => {
    setIsTransitioning(true); // Ensure transition is enabled for dot navigation
    setCurrentSlide(index);
  };

  return (
    <div className="carousel-container">
      <div
        className="carousel-slides"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
          transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="carousel-slide"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="carousel-overlay">
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="carousel-dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentSlide === index ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
      <button className="carousel-arrow arrow-left" onClick={goToPrevious}>
        ❮
      </button>
      <button className="carousel-arrow arrow-right" onClick={goToNext}>
        ❯
      </button>
    </div>
  );
};

export default CarouselSection;