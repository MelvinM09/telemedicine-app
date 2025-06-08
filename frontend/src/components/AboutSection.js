import React from 'react';
import styled from 'styled-components';

const AboutContainer = styled.section`
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #e0e7ff 100%); /* Subtle gradient */
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%; /* Fit within snap-section */
  max-height: calc(100vh ); /* Match HomePage snap-section */
  box-sizing: border-box;
  // margin-top: 64px;
  overflow-y: auto; /* Allow scrolling if content overflows */
  animation: fadeIn 1s ease-in-out; /* Fade-in animation */

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ContentWrapper = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  max-width: 900px;
  width: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: rgb(17, 0, 100);
  margin-bottom: 1.5rem;
  position: relative;
  letter-spacing: 0.02rem;

  &::after {
    content: '';
    display: block;
    width: 100px;
    height: 5px;
    background: linear-gradient(to right, rgb(101, 79, 191), rgb(149, 128, 255)); /* Gradient underline */
    margin: 0.75rem auto 0;
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 120px; /* Animate underline on hover */
  }
`;

const Description = styled.p`
  font-size: 1.3rem;
  line-height: 1.9;
  color: rgb(0, 18, 108);
  max-width: 700px;
  margin: 0 auto 1.5rem;
`;

const HighlightText = styled.span`
  color: rgb(101, 79, 191);
  font-weight: 500;
`;

const CTAButton = styled.button`
  background: rgb(101, 79, 191);
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s ease;

  &:hover {
    background: rgb(149, 128, 255);
    transform: scale(1.05);
  }

  &:focus {
    outline: 2px solid rgb(17, 0, 100);
    outline-offset: 2px;
  }
`;

const AboutSection = () => (
  <AboutContainer role="region" aria-labelledby="about-title">
    <ContentWrapper>
      <SectionTitle id="about-title">About Telemedicine</SectionTitle>
      <Description>
        Telemedicine bridges the gap between <HighlightText>patients and doctors</HighlightText> by offering remote consultations, digital prescriptions, and easy follow-ups — all from the comfort of your home. Our platform ensures <HighlightText>secure, ETE Encryption</HighlightText> communication with licensed healthcare professionals.
      </Description>
      <CTAButton aria-label="Learn more about telemedicine">Learn More</CTAButton>
    </ContentWrapper>
  </AboutContainer>
);

export default AboutSection;