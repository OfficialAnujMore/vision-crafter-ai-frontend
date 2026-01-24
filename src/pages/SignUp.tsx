import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import CustomButton from '../components/CustomButton';
import CustomText from '../components/CustomText';
import { ROUTES } from '../constants/routes';
import { authService } from '../services/api/authService';
import '../styles/SignUp.css';
import { textVariant } from '../constants/textVarients';
import { buttonVarients } from '../constants/buttonVarients';
import { ArrowLeft } from 'lucide-react';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setError('');

    try {
      if (!credentialResponse.credential) {
        throw new Error('No credential received from Google');
      }

      // Send the Google ID token to backend
      await authService.googleAuth(credentialResponse.credential);

      // Redirect to dashboard on success
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      console.error('Google sign-in error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in with Google. Please try again.';
      setError(errorMessage);
    }
  };

  const handleGoogleError = () => {
    setError('Google sign-in failed. Please try again.');
  };

  const features = [
    { icon: '🎨', text: 'AI-powered creative tools' },
    { icon: '⚡', text: 'Lightning-fast processing' },
    { icon: '🔒', text: 'Secure and private' },
  ];

  return (
    <div className="signup-container">
      {/* Left Side - Branding */}
      <div className="signup-left">
        <div className="signup-left-content">
          <CustomButton
            variant={buttonVarients.icon}
            icon={<ArrowLeft />}
            onClick={() => navigate(ROUTES.HOME)}
          />
          <CustomText
            variant={textVariant.h3}
            text="Vision Crafter AI"

          />
        </div>
        <div className="signup-slogan">
          <CustomText
            variant={textVariant.h1}
            text="Transform Your Imagination Into Reality"
          />
          <CustomText
            variant={textVariant.h2}
            text="The future of editing with AI" />
        </div>
      </div>

      {/* Right Side - Google Sign Up */}
      <div className="signup-right">
        <div className="signup-form">
          <div className="signup-header">
            <CustomText
              variant={textVariant.h1}
              text="Get Started" />
            <CustomText
              variant={textVariant.p}
              text="Sign up to start creating with AI-powered tools"
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="signup-google-container">
            <div className="google-login-wrapper">
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
          </div>

          <div className="signup-divider">
            <CustomText
              variant={textVariant.h3}
              text="Quick and secure sign up"
            />
          </div>

          <div className="signup-features">
            {features.map((feature, index) => (
              <div key={index} className="feature-item">
                <span className="feature-icon">{feature.icon}</span>
                <CustomText
                  variant={textVariant.p}
                  text={feature.text} />
              </div>
            ))}
          </div>

          <div className="signup-footer">
            <CustomText
              variant={textVariant.p}
              text="By signing up, you agree to our Terms of Service and Privacy Policy"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
