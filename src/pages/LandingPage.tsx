import React, { useRef } from 'react';
import CustomText from '../components/CustomText';
import { LANDING_PAGE } from '../utils/local/en';
import '../styles/LandingPage.css';
import { textVariant } from '../constants/textVarients';

const LandingPage: React.FC = () => {
  const homeRef = useRef<HTMLDivElement>(null);

  return (
    <div className="landing-page">
      <section ref={homeRef} className="hero-section">
        <div className="hero-content">
          <CustomText
            variant={textVariant.h1}
            text={LANDING_PAGE.homeTitle}
          />
        </div>

      </section>

    </div>
  );
};

export default LandingPage;
