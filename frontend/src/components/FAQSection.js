// FAQSection.js
import React, { useState } from 'react';
import styled from 'styled-components';

const FAQContainer = styled.section`
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
  // margin-top: 64px;
`;

const FAQItem = styled.div`
  max-width: 800px;
  width: 100%;
  margin-bottom: 1rem;
`;

const Question = styled.button`
  background: white;
  border: none;
  width: 100%;
  padding: 1rem;
  text-align: left;
  font-size: 1.2rem;
  font-weight: 600;
  color: rgb(17, 0, 100);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.3s ease;

  &:hover {
    background: rgb(240, 244, 255);
  }
`;

const Answer = styled.div`
  max-height: ${(props) => (props.isOpen ? '200px' : '0')};
  overflow: hidden;
  transition: max-height 0.3s ease;
  padding: ${(props) => (props.isOpen ? '1rem' : '0 1rem')};
  font-size: 1rem;
  color: rgb(0, 18, 108);
  background: white;
  border-radius: 0 0 8px 8px;
`;

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { question: 'Is the platform secure?', answer: 'Yes, we use End-to-End encryption.' },
    { question: 'What devices are supported?', answer: 'Our app works on smartphones, tablets, and desktops.' },
    { question: 'How do I book an appointment?', answer: 'Simply sign up and choose a time slot.' },
  ];

  return (
    <FAQContainer role="region" aria-labelledby="faq-title">
      <h2 id="faq-title" style={{ fontSize: '2.5rem', color: 'rgb(17, 0, 100)', marginBottom: '2rem' }}>
        Frequently Asked Questions
      </h2>
      {faqs.map((faq, index) => (
        <FAQItem key={index}>
          <Question onClick={() => setOpenIndex(openIndex === index ? null : index)}>
            {faq.question}
            <span>{openIndex === index ? '−' : '+'}</span>
          </Question>
          <Answer isOpen={openIndex === index}>{faq.answer}</Answer>
        </FAQItem>
      ))}
    </FAQContainer>
  );
};

export default FAQSection;