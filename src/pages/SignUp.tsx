import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import CustomText from '../components/CustomComponents/CustomText';
import CustomButton from '../components/CustomComponents/CustomButton';
import EditorPreviewCard from '../components/CustomComponents/EditorPreviewCard';
import { ROUTES } from '../constants/routes';
import { authService } from '../services/api/authService';
import { textVariant } from '../constants/textVariants';
import { buttonVariants } from '../constants/buttonVariants';
import { ArrowLeft, Sparkles, Wand2, Shield, Zap } from 'lucide-react';
import '../styles/SignUp.css';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (authService.isAuthenticated()) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setError('');
    setIsLoading(true);

    try {
      if (!credentialResponse.credential) {
        throw new Error('No credential received from Google');
      }

      await authService.googleAuth(credentialResponse.credential);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      console.error('Google sign-in error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in with Google. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google sign-in failed. Please try again.');
  };

  const features = [
    { icon: <Wand2 size={18} />, text: 'AI-powered creative tools' },
    { icon: <Zap size={18} />, text: 'Lightning-fast processing' },
    { icon: <Shield size={18} />, text: 'Secure and private' },
  ];

  return (
    <div className="signup-container">
              <div className="signup-left-grid" />
      <div className="signup-left">
        <div className="signup-left-glow" />
        <div className="signup-left-grid" />

        <div className="signup-left-top">
          <CustomButton
            variant={buttonVariants.icon}
            icon={<ArrowLeft />}
            onClick={() => navigate(ROUTES.HOME)}
          />
          <div className="signup-logo">
            <Sparkles size={18} />
            <CustomText variant={textVariant.h4} text="Vision Crafter AI" />
          </div>
        </div>

        <div className="signup-left-center">
          <EditorPreviewCard compact />
        </div>

        <div className="signup-slogan">
          <CustomText
            variant={textVariant.h1}
            text="Transform Your Imagination Into Reality"
          />
          <p className="signup-slogan-sub">
            AI-powered image editing, right in your browser.
          </p>
        </div>
      </div>

      {/* Right Side — Sign-in Form */}
      <div className="signup-right">
        <div className="signup-form">
          <div className="signup-header">
            <CustomText variant={textVariant.h2} text="Get Started" />
            <p className="signup-header-desc">
              Sign up to start creating with AI-powered tools
            </p>
          </div>

          {error && (
            <div className="signup-error">
              {error}
            </div>
          )}

          <div className="signup-google-container">
            {isLoading ? (
              <div className="signup-loading">
                <div className="signup-spinner" />
                <p className="signup-loading-text">Signing you in...</p>
              </div>
            ) : (
              <div className="signup-google-wrapper">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  size="large"
                  text="continue_with"
                  width="400"
                  logo_alignment="left"
                />
              </div>
            )}
          </div>

          <div className="signup-divider">
            <span>Quick and secure sign up</span>
          </div>

          <div className="signup-features">
            {features.map((feature, index) => (
              <div key={index} className="signup-feature-item">
                <span className="signup-feature-icon">{feature.icon}</span>
                <span className="signup-feature-text">{feature.text}</span>
              </div>
            ))}
          </div>

          <div className="signup-footer">
            <p>By signing up, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
