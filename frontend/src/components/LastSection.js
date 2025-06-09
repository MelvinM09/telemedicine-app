import React from 'react';
import styled from 'styled-components';
import { FaTwitter, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';

const FooterContainer = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(
    180deg,
rgba(250, 241, 206, 0.54) 0%,       /* Rich gold */
rgba(245, 230, 179, 0.85) 40%,      /* Light gold */
    #FFF8E1 70%,      /* Warm white */
    #FFFFFF 100%      /* Pure white */
  );
  color: #333;        /* Dark text for contrast */
  text-align: center;
  padding: 1rem;
  min-height: 88.5vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 1.5rem;
  font-weight: 400;
  letter-spacing: 0.015rem;
  position: relative;
  overflow: hidden;
  
  /* Subtle shimmer animation */
  animation: gentleShimmer 8s ease infinite alternate;
  
  @keyframes gentleShimmer {
    0% { background-position: 0% 50%; }
    100% { background-position: 100% 50%; }
  }
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  width: 100%;
  flex-grow: 1;
  z-index: 2;
`;

const FooterTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #5E4B1D; /* Deep gold text */
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5);
`;

const FooterText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  max-width: 600px;
  line-height: 1.6;
  color: #5E4B1D; /* Deep gold text */
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const SocialLink = styled.a`
  color: #5E4B1D; /* Gold text */
  font-size: 1.8rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(212, 175, 55, 0.3);

  &:hover {
    color: #D4AF37;
    transform: translateY(-5px) scale(1.1);
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const FooterBottom = styled.div`
  position: absolute;
  bottom: 2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
`;

const ContactLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
`;

const ContactLink = styled.a`
  color: #5E4B1D;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 0.8rem 1.5rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    color: #D4AF37;
    background: rgba(255, 255, 255, 1);
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const CopyrightText = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #5E4B1D;
  font-weight: 500;
`;

const GoldFlakes = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
`;

const GoldFlake = styled.div`
  position: absolute;
  background: rgba(212, 175, 55, ${() => Math.random() * 0.5 + 0.3});
  width: ${() => Math.random() * 6 + 2}px;
  height: ${() => Math.random() * 6 + 2}px;
  border-radius: 50%;
  animation: float ${() => Math.random() * 10 + 10}s linear infinite;
  top: -10%;
  left: ${() => Math.random() * 100}%;
  opacity: ${() => Math.random() * 0.7 + 0.3};

  @keyframes float {
    0% {
      transform: translateY(0) rotate(0deg);
    }
    100% {
      transform: translateY(100vh) rotate(360deg);
    }
  }
`;

const generateFlakes = () => {
  return Array.from({ length: 30 }).map((_, i) => (
    <GoldFlake key={i} style={{
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${Math.random() * 15 + 10}s`
    }} />
  ));
};

const LastSection = () => (
  <FooterContainer role="contentinfo">
    <GoldFlakes>
      {generateFlakes()}
    </GoldFlakes>
    <FooterContent>
      <FooterTitle>Get Involved</FooterTitle>
      <FooterText>
        Join our community to help shape the future of telehealth! Share your feedback, volunteer as a beta tester, or connect with us to explore partnership opportunities.
      </FooterText>
      <SocialLinks>
        <SocialLink href="https://twitter.com" aria-label="Twitter">
          <FaTwitter />
        </SocialLink>
        <SocialLink href="https://facebook.com" aria-label="Facebook">
          <FaFacebookF />
        </SocialLink>
        <SocialLink href="https://linkedin.com" aria-label="LinkedIn">
          <FaLinkedinIn />
        </SocialLink>
      </SocialLinks>
    </FooterContent>
    <FooterBottom>
      <ContactLinks>
        <ContactLink href="mailto:melvinm1391@gmail.com">Email Us</ContactLink>
        <ContactLink href="tel:+917676802719">Call Us</ContactLink>
      </ContactLinks>
      <CopyrightText>
        © {new Date().getFullYear()} Telemedicine App. All rights reserved.
      </CopyrightText>
    </FooterBottom>
  </FooterContainer>
);

export default LastSection;