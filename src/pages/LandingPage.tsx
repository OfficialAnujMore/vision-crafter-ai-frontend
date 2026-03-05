import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomText from '../components/CustomComponents/CustomText';
import CustomButton from '../components/CustomComponents/CustomButton';
import { LANDING_PAGE } from '../utils/local/en';
import { ROUTES } from '../constants/routes';
import { textVariant } from '../constants/textVariants';
import { buttonVariants } from '../constants/buttonVariants';
import {
  Eraser,
  Expand,
  Type,
  SlidersHorizontal,
  Crop,
  Cloud,
  ArrowRight,
  Sparkles,
  Upload,
  Wand2,
  Download,
} from 'lucide-react';
import EditorPreviewCard from '../components/CustomComponents/EditorPreviewCard';
import '../styles/LandingPage.css';

const FEATURE_ICONS: Record<string, React.ReactElement> = {
  eraser: <Eraser size={28} />,
  expand: <Expand size={28} />,
  type: <Type size={28} />,
  sliders: <SlidersHorizontal size={28} />,
  crop: <Crop size={28} />,
  cloud: <Cloud size={28} />,
};

const STEP_ICONS = [
  <Upload size={32} key="upload" />,
  <Wand2 size={32} key="wand" />,
  <Download size={32} key="download" />,
];

const useInView = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
};

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const features = useInView(0.1);
  const howItWorks = useInView(0.1);
  const cta = useInView(0.2);

  return (
    <div className="landing-page">
      {/* ===== HERO ===== */}
      <section ref={heroRef} className="hero-section">
        <div className="hero-glow hero-glow--left" />
        <div className="hero-glow hero-glow--right" />

        <div className="hero-content">
          <span className="hero-badge">
            <Sparkles size={14} />
            AI-Powered Image Editor
          </span>

          <CustomText variant={textVariant.h1} text={LANDING_PAGE.homeTitle} />

          <p className="hero-subtitle">{LANDING_PAGE.homeSubtitle}</p>
          <p className="hero-description">{LANDING_PAGE.homeDescription}</p>

          <div className="hero-actions">
            <CustomButton
              variant={buttonVariants.outline}
              text={LANDING_PAGE.homeCtaButton}
              icon={<ArrowRight size={18} />}
              onClick={() => navigate(ROUTES.SIGNUP)}
            />
          </div>
        </div>

        <div className="hero-visual">
          <EditorPreviewCard />
        </div>
      </section>

      {/* ===== STATS ===== */}
      {/* <section ref={stats.ref} className={`stats-section${stats.visible ? ' in-view' : ''}`}>
        <div className="stats-grid">
          {LANDING_PAGE.stats.map((s, i) => (
            <div className="stat-item" key={i} style={{ transitionDelay: `${i * 100}ms` }}>
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section> */}

      {/* ===== FEATURES ===== */}
      <section
        id="features"
        ref={features.ref}
        className={`features-section${features.visible ? ' in-view' : ''}`}
      >
        <div className="section-header">
          <CustomText variant={textVariant.h2} text={LANDING_PAGE.featuresTitle} />
          <p className="section-subtitle">{LANDING_PAGE.featuresSubtitle}</p>
        </div>

        <div className="features-grid">
          {LANDING_PAGE.features.map((f, i) => (
            <div
              className="feature-card"
              key={i}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="feature-icon">
                {FEATURE_ICONS[f.icon] ?? <Sparkles size={28} />}
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section
        ref={howItWorks.ref}
        className={`how-it-works-section${howItWorks.visible ? ' in-view' : ''}`}
      >
        <div className="section-header">
          <CustomText variant={textVariant.h2} text={LANDING_PAGE.howItWorksTitle} />
          <p className="section-subtitle">{LANDING_PAGE.howItWorksSubtitle}</p>
        </div>

        <div className="steps-grid">
          {LANDING_PAGE.steps.map((s, i) => (
            <div className="step-card" key={i} style={{ transitionDelay: `${i * 120}ms` }}>
              <div className="step-number">{s.step}</div>
              <div className="step-icon">{STEP_ICONS[i]}</div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.description}</p>
              {i < LANDING_PAGE.steps.length - 1 && (
                <ArrowRight size={20} className="step-arrow" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ===== PRICING ===== */}
      {/* <section
        id="pricing"
        ref={pricing.ref}
        className={`pricing-section${pricing.visible ? ' in-view' : ''}`}
      >
        <div className="section-header">
          <CustomText variant={textVariant.h2} text={LANDING_PAGE.pricingTitle} />
          <p className="section-subtitle">{LANDING_PAGE.pricingSubtitle}</p>
        </div>

        <div className="pricing-grid">
          {LANDING_PAGE.plans.map((plan, i) => (
            <div
              className={`pricing-card${plan.popular ? ' pricing-card--popular' : ''}`}
              key={i}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {plan.popular && <span className="popular-badge">Most Popular</span>}
              <h3 className="pricing-name">{plan.name}</h3>
              <p className="pricing-desc">{plan.description}</p>
              <div className="pricing-price">
                <span className="pricing-amount">{plan.price}</span>
                {plan.period && <span className="pricing-period">{plan.period}</span>}
              </div>
              <ul className="pricing-features">
                {plan.features.map((feat, fi) => (
                  <li key={fi}>
                    <Check size={16} className="pricing-check" />
                    {feat}
                  </li>
                ))}
              </ul>
              <CustomButton
                variant={plan.popular ? buttonVariants.default : buttonVariants.outline}
                text={plan.buttonText}
                onClick={() => navigate(ROUTES.SIGNUP)}
                className="pricing-btn"
              />
            </div>
          ))}
        </div>
      </section> */}

      {/* ===== CTA ===== */}
      <section ref={cta.ref} className={`cta-section${cta.visible ? ' in-view' : ''}`}>
        <div className="cta-glow" />
        <div className="cta-content">
          <CustomText
            variant={textVariant.h2}
            text="Ready to Craft Your Vision?"
          />
          <p className="cta-desc">
            Join creators using AI to bring their ideas to life.
          </p>
          <CustomButton
            variant={buttonVariants.default}
            text="Get Started for Free"
            icon={<ArrowRight size={18} />}
            onClick={() => navigate(ROUTES.SIGNUP)}
          />
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-logo">
              <Sparkles size={18} />
              <span>{LANDING_PAGE.navLogo}</span>
            </div>
            <p className="footer-tagline">{LANDING_PAGE.footerTagline}</p>
          </div>
          <div className="footer-links">
            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
              Features
            </button>
            <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
              Pricing
            </button>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} {LANDING_PAGE.footerCopyright}</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
