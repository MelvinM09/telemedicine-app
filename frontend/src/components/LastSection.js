import React from 'react';
import styled from 'styled-components';
import { FaTwitter, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';

const FooterContainer = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(180deg, #0f0f0f 0%, #b89b5e 50%, #e8e8e8 100%); /* Premium black, gold, white fade */
  color: white;
  text-align: center;
  padding: 1rem;
  height: 88.5vh; /* Matches provided height */
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 1.5rem;
  font-weight: 400;
  letter-spacing: 0.015rem;
  margin-top: 64px;
  position: relative;
  overflow: hidden;
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1.5rem 0;
  width: 100%;
  flex-grow: 1;
`;

const FooterTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color:rgb(255, 255, 255);
  // text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5); /* Stronger shadow for visibility */
`;

const FooterText = styled.p`
  font-size: 1.1rem;
  margin-bottom: 1rem;
  max-width: 500px;
  line-height: 1.6;
  color:rgb(255, 255, 255);
  // text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5); /* Shadow for contrast */
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const SocialLink = styled.a`
  color: #ffffff; /* White for visibility */
  font-size: 1.5rem;
  transition: transform 0.3s ease, color 0.3s ease;

  &:hover {
    color: #b89b5e; /* Gradient's gold on hover */
    transform: scale(1.2);
  }

  &:focus {
    outline: 2px solid #ffffff;
    outline-offset: 2px;
  }
`;

const FooterBottom = styled.div`
  position: absolute;
  bottom: 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContactLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

const ContactLink = styled.a`
  color:rgb(7, 7, 7); /* White for visibility */
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease, transform 0.3s ease;

  &:hover {
    color: #b89b5e; /* Gradient's gold on hover */
    transform: translateY(-2px);
  }

  &:focus {
    outline: 2px solid #ffffff;
    outline-offset: 2px;
  }
`;

const CopyrightText = styled.p`
  margin: 0;
  font-size: 1rem;
  color:rgb(0, 0, 0); /* White for visibility */
  // text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5); /* Shadow for contrast */
`;

const LastSection = () => (
  <FooterContainer role="contentinfo">
    <FooterContent>
      <FooterTitle>Get Involved</FooterTitle>
      <FooterText>
        Join our community to help shape the future of telehealth! Share your feedback, volunteer as a beta tester, or connect with us to explore partnership opportunities. Your input makes healthcare more accessible for everyone.
      </FooterText>
      <SocialLinks>
        <SocialLink href="https://twitter.com/telemedicineapp" aria-label="Twitter">
          <FaTwitter />
        </SocialLink>
        <SocialLink href="https://facebook.com/telemedicineapp" aria-label="Facebook">
          <FaFacebookF />
        </SocialLink>
        <SocialLink href="https://linkedin.com/company/telemedicineapp" aria-label="LinkedIn">
          <FaLinkedinIn />
        </SocialLink>
      </SocialLinks>
    </FooterContent>
    <FooterBottom>
      <ContactLinks>
        <ContactLink href="mailto:melvinm1391@gmail.com">melvinm1391@gmail.com</ContactLink>
        <ContactLink href="tel:+91 7676802719">+91 7676802719</ContactLink>
      </ContactLinks>
      <CopyrightText>
        © {new Date().getFullYear()} Telemedicine App. All rights reserved.
      </CopyrightText>
    </FooterBottom>
  </FooterContainer>
);

export default LastSection;