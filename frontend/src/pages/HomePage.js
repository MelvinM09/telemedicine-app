import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import StepsSection from '../components/StepsSection';
import CTSection from '../components/CTSection';
import CarouselSection from '../components/CarouselSection';
import TestimonialsSection from '../components/TestimonialsSection';
import FeaturesSection from '../components/FeaturesSection';
import FAQSection from '../components/FAQSection';
import './HomePage.css';
import LastSection from '../components/LastSection';
const HomePage = () => {
  return (
    <div className="page-container">
      <section className="page-section">
        <HeroSection />
      </section>
      <section className="page-section">
        <CarouselSection />
      </section>
      <section className="page-section cts-steps-section">
        <CTSection />
        <StepsSection />
      </section>
      <section className="page-section">
        <FeaturesSection />
      </section>
      <section className="page-section">
        <TestimonialsSection />
      </section>
      <section className="page-section about-section">
        <AboutSection />
      </section>
      <section className="page-section">
        <FAQSection />
      </section>
      <section className="page-section"> {/* Add page-section here */}
        <LastSection />
      </section>
    </div>
  );
};

export default HomePage;