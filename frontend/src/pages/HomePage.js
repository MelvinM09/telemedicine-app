// pages/HomePage.js
import React from 'react';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import StepsSection from '../components/StepsSection';
import CTSection from '../components/CTSection';
import CarouselSection from '../components/CarouselSection';


const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <CTSection />
      <CarouselSection />
      
      
      <AboutSection />
      <StepsSection />
      
      
    </div>
  );
};

export default HomePage;
