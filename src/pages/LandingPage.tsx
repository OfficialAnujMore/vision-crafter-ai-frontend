import React, { useRef } from 'react';
import CustomText from '../components/CustomText';
import { LANDING_PAGE } from '../utils/local/en';
import '../styles/LandingPage/LandingPage.css';

const LandingPage: React.FC = () => {
  // const navigate = useNavigate();
  const homeRef = useRef<HTMLDivElement>(null);

  return (
    <div className="landing-page">
      {/* Home Section */}
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
