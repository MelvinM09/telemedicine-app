// TestimonialsSection.js
import React from 'react';
import styled from 'styled-components';

const TestimonialsContainer = styled.section`
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #ffffff, #f0f4ff);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  max-height: calc(100vh );
  box-sizing: border-box;
  overflow-y: auto;
//   margin-top: 64px;
`;

const TestimonialCard = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  max-width: 350px;
  margin: 1rem;
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-5px);
  }
`;

const Quote = styled.p`
  font-size: 1.1rem;
  color: rgb(0, 18, 108);
  line-height: 1.6;
`;

const Author = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: rgb(101, 79, 191);
  margin-top: 1rem;
`;

const TestimonialsSection = () => (
  <TestimonialsContainer role="region" aria-labelledby="testimonials-title">
    <h2 id="testimonials-title" style={{ fontSize: '2.5rem', color: 'rgb(17, 0, 100)', marginBottom: '2rem' }}>
      What Our Users Say
    </h2>
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
      <TestimonialCard>
        <Quote>"The doctor was professional and helped me in minutes from home!"</Quote>
        <Author>— Jane D., Patient</Author>
      </TestimonialCard>
      <TestimonialCard>
        <Quote>"Secure and easy-to-use platform for consultations."</Quote>
        <Author>— Dr. John S., Physician</Author>
      </TestimonialCard>
    </div>
  </TestimonialsContainer>
);

export default TestimonialsSection;