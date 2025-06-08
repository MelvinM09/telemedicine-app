// FeaturesSection.js
import React from 'react';
import styled from 'styled-components';

const FeaturesContainer = styled.section`
  padding: 4rem 2rem;
  background: #ffffff;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  max-height: calc(100vh - 0.5rem);
  box-sizing: border-box;
  overflow-y: auto;
//   margin-top: 64px;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  width: 100%;
`;

const FeatureCard = styled.div`
  background: linear-gradient(135deg, #f5f7fa, #e0e7ff);
  border-radius: 10px;
  padding: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  color: rgb(17, 0, 100);
  margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  color: rgb(0, 18, 108);
`;

const FeaturesSection = () => (
  <FeaturesContainer role="region" aria-labelledby="features-title">
    <h2 id="features-title" style={{ fontSize: '2.5rem', color: 'rgb(17, 0, 100)', marginBottom: '2rem' }}>
      Why Choose Us?
    </h2>
    <FeatureGrid>
      <FeatureCard>
        <FeatureTitle>Video Consultations</FeatureTitle>
        <FeatureDescription>Connect with doctors via secure video calls.</FeatureDescription>
      </FeatureCard>
      <FeatureCard>
        <FeatureTitle>E-Prescriptions</FeatureTitle>
        <FeatureDescription>Receive prescriptions instantly online.</FeatureDescription>
      </FeatureCard>
      <FeatureCard>
        <FeatureTitle>24/7 Access</FeatureTitle>
        <FeatureDescription>Get care anytime, anywhere.</FeatureDescription>
      </FeatureCard>
    </FeatureGrid>
  </FeaturesContainer>
);

export default FeaturesSection;