import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import CustomButton from '../components/CustomButton';
import CustomText from '../components/CustomText';
import { ROUTES } from '../constants/routes';
import { authService } from '../services/api/authService';
import '../styles/SignUp/SignUp.css';

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
          <CustomText variant="h3" value="Vision Crafter AI" color="white" />
          <CustomButton
            variant="secondary"
            text="Back to website →"
            onClick={() => navigate(ROUTES.HOME)}
          />
        </div>
        <div className="signup-slogan">
          <CustomText variant="h2" value="Transform Your Imagination Into Reality" color="white" />
          <CustomText variant="h2" value="The future of editing with AI" color="white" />
        </div>
      </div>

      {/* Right Side - Google Sign Up */}
      <div className="signup-right">
        <div className="signup-form">
          <div className="signup-header">
            <CustomText variant="h2" value="Get Started" color="white" />
            <CustomText
              variant="p"
              value="Sign up to start creating with AI-powered tools"
              color="secondary"
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
            <CustomText variant="caption" value="Quick and secure sign up" color="secondary" />
          </div>

          <div className="signup-features">
            {features.map((feature, index) => (
              <div key={index} className="feature-item">
                <span className="feature-icon">{feature.icon}</span>
                <CustomText variant="p" value={feature.text} color="white" />
              </div>
            ))}
          </div>

          <div className="signup-footer">
            <CustomText
              variant="caption"
              value="By signing up, you agree to our Terms of Service and Privacy Policy"
              color="secondary"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
