import React, { useRef } from 'react';
import Navbar from '../components/Navbar';
import CustomButton from '../components/CustomButton';
import CustomText from '../components/CustomText';
import { LANDING_PAGE } from '../utils/local/en';
import '../styles/LandingPage/LandingPage.css';

const LandingPage: React.FC = () => {
  const homeRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);

  const handleNavClick = (section: 'home' | 'features' | 'pricing') => {
    let ref: React.RefObject<HTMLDivElement> | null = null;

    switch (section) {
      case 'home':
        ref = homeRef as React.RefObject<HTMLDivElement>;
        break;
      case 'features':
        ref = featuresRef as React.RefObject<HTMLDivElement>;
        break;
      case 'pricing':
        ref = pricingRef as React.RefObject<HTMLDivElement>;
        break;
    }

    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-page">
      <Navbar onNavClick={handleNavClick} />

      {/* Home Section */}
      <section ref={homeRef} className="hero-section">
        <div className="hero-content">
          <CustomText
            variant="h1"
            value={LANDING_PAGE.homeTitle}
            color="white"
          />
          <CustomText
            variant="h3"
            value={LANDING_PAGE.homeSubtitle}
            color="secondary"
          />
          <CustomText
            variant="p"
            value={LANDING_PAGE.homeDescription}
            color="secondary"
          />
          <CustomButton
            variant="primary"
            text={LANDING_PAGE.homeCtaButton}
            onClick={() => window.location.href = '/signup'}
          />
        </div>
        <div className="hero-image-container">
          <div className="hero-image-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1482784160316-6eb046863ece"
              alt="AI Powered Editing"
              className="hero-image"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="section features-section">
        <div className="section-header">
          <CustomText
            variant="h2"
            value={LANDING_PAGE.featuresTitle}
            color="white"
          />
          <CustomText
            variant="p"
            value={LANDING_PAGE.featuresSubtitle}
            color="secondary"
          />
        </div>

        <div className="features-grid">
          {LANDING_PAGE.features.map((feature, index) => (
            <div key={index} className="feature-card">
              <CustomText
                variant="h4"
                value={feature.title}
                color="white"
              />
              <CustomText
                variant="p"
                value={feature.description}
                color="secondary"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section ref={pricingRef} className="section pricing-section">
        <div className="section-header">
          <CustomText
            variant="h2"
            value={LANDING_PAGE.pricingTitle}
            color="white"
          />
          <CustomText
            variant="p"
            value={LANDING_PAGE.pricingSubtitle}
            color="secondary"
          />
        </div>

        <div className="pricing-grid">
          {LANDING_PAGE.plans.map((plan, index) => (
            <div key={index} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
              <CustomText
                variant="h4"
                value={plan.name}
                color="white"
              />
              <div className="pricing-amount">
                <CustomText
                  variant="h2"
                  value={plan.price}
                  color="primary"
                />
                {plan.price !== "Custom" && <span>/month</span>}
              </div>
              <CustomText
                variant="p"
                value={plan.description}
                color="secondary"
              />

              <ul className="features-list">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex}>
                    <CustomText
                      variant="caption"
                      value={feature}
                      color="secondary"
                    />
                  </li>
                ))}
              </ul>

              <CustomButton
                variant={plan.popular ? 'primary' : 'secondary'}
                text={plan.buttonText}
                onClick={() => console.log(`Selected ${plan.name}`)}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
