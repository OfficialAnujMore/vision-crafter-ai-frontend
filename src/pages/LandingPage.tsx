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
  Check,
  Coins,
  Github,
  Linkedin,
  Mail,
  Globe,
  MapPin,
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
  const pricing = useInView(0.1);
  const about = useInView(0.1);
  const cta = useInView(0.2);

  const dev = LANDING_PAGE.developer;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

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

          <ul className="hero-highlights">
            {LANDING_PAGE.homeHighlights.map((h, i) => (
              <li key={i}>
                <Check size={16} className="hero-highlight-icon" />
                {h}
              </li>
            ))}
          </ul>

          <div className="hero-actions">
            <CustomButton
              variant={buttonVariants.default}
              text={LANDING_PAGE.homeCtaButton}
              icon={<ArrowRight size={18} />}
              onClick={() => navigate(ROUTES.SIGNUP)}
            />
            <button
              className="hero-secondary-btn"
              onClick={() => scrollTo('pricing')}
            >
              {LANDING_PAGE.homeSecondaryCta}
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <EditorPreviewCard />
        </div>
      </section>

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
      <section
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
              {plan.popular && <span className="popular-badge">Best Value</span>}
              <h3 className="pricing-name">{plan.name}</h3>
              <p className="pricing-desc">{plan.description}</p>
              <div className="pricing-price">
                <span className="pricing-amount">{plan.price}</span>
                {plan.period && <span className="pricing-period">{plan.period}</span>}
              </div>
              <div className="pricing-token-badge">
                <Coins size={14} />
                {plan.tokens}
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

        <div className="token-cost-card">
          <div className="token-cost-header">
            <Coins size={18} />
            <h4>{LANDING_PAGE.tokenCostsTitle}</h4>
          </div>
          <div className="token-cost-grid">
            {LANDING_PAGE.tokenCosts.map((tc, i) => (
              <div className="token-cost-row" key={i}>
                <span className="token-cost-action">{tc.action}</span>
                <span className="token-cost-value">{tc.cost}</span>
              </div>
            ))}
          </div>
          <p className="token-cost-note">
            Non-AI editing (crop, resize, text, filters, adjustments) is always free and unlimited.
          </p>
        </div>
      </section>

      {/* ===== ABOUT DEVELOPER ===== */}
      <section
        id="about"
        ref={about.ref}
        className={`about-section${about.visible ? ' in-view' : ''}`}
      >
        <div className="section-header">
          <CustomText variant={textVariant.h2} text={LANDING_PAGE.aboutTitle} />
          <p className="section-subtitle">{LANDING_PAGE.aboutSubtitle}</p>
        </div>

        <div className="about-card">
          <div className="about-left">
            <div className="about-avatar">
              {dev.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <h3 className="about-name">{dev.name}</h3>
            <p className="about-role">{dev.role}</p>
            <div className="about-location">
              <MapPin size={14} />
              {dev.location}
            </div>

            <div className="about-socials">
              <a href={dev.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github size={18} />
              </a>
              <a href={dev.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href={dev.portfolio} target="_blank" rel="noopener noreferrer" aria-label="Portfolio">
                <Globe size={18} />
              </a>
              <a href={`mailto:${dev.email}`} aria-label="Email">
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div className="about-right">
            <p className="about-bio">{dev.bio}</p>

            <ul className="about-highlights">
              {dev.highlights.map((h, i) => (
                <li key={i}>
                  <Check size={16} className="about-check" />
                  {h}
                </li>
              ))}
            </ul>

            <div className="about-contact">
              <a href={`mailto:${dev.email}`} className="about-contact-item">
                <Mail size={14} />
                {dev.email}
              </a>
              <a href={dev.portfolio} target="_blank" rel="noopener noreferrer" className="about-contact-item">
                <Globe size={14} />
                {dev.portfolio.replace('https://', '')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section ref={cta.ref} className={`cta-section${cta.visible ? ' in-view' : ''}`}>
        <div className="cta-glow" />
        <div className="cta-content">
          <CustomText
            variant={textVariant.h2}
            text="Ready to Craft Your Vision?"
          />
          <p className="cta-desc">
            Join creators using AI to bring their ideas to life. Start with 50 free tokens — no credit card required.
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
            <button onClick={() => scrollTo('features')}>Features</button>
            <button onClick={() => scrollTo('pricing')}>Pricing</button>
            <button onClick={() => scrollTo('about')}>About</button>
            <a href={dev.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href={dev.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
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
