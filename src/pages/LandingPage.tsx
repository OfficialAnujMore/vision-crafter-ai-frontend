import React, { useRef } from 'react';
import CustomText from '../components/CustomText';
import { LANDING_PAGE } from '../utils/local/en';
import '../styles/LandingPage.css';

const LandingPage: React.FC = () => {
  const homeRef = useRef<HTMLDivElement>(null);

  return (
    <div className="landing-page">
      <section ref={homeRef} className="hero-section">
        <div className="hero-content">
          <CustomText
            variant="h3"
            value={LANDING_PAGE.homeTitle}
            color="white"
          />
        </div>

      </section>

    </div>
  );
};

export default LandingPage;
