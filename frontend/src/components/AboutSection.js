import React from 'react';
import styled from 'styled-components';

const AboutContainer = styled.section`
  padding: 5rem 2rem;
  background: white;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 2.2rem;
  color:rgb(17, 0, 100);
  margin-bottom: 2rem;
  position: relative;
  
  &::after {
    content: '';
    display: block;
    width: 80px;
    height: 4px;
    background:rgb(101, 79, 191);
    margin: 1rem auto 0;
  }
`;

const Description = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  color:rgb(0, 18, 108);
  max-width: 800px;
  margin: 0 auto;
`;

const AboutSection = () => (
  <AboutContainer>
    <SectionTitle>About Telemedicine</SectionTitle>
    <Description>
      Telemedicine bridges the gap between patients and doctors by offering remote consultations, 
      digital prescriptions, and easy follow-ups — all from the comfort of your home. 
      Our platform ensures secure, HIPAA-compliant communication with licensed healthcare professionals.
    </Description>
  </AboutContainer>
);

export default AboutSection;