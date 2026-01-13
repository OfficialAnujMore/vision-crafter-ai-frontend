import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../components/CustomButton';
import CustomText from '../components/CustomText';
import { ROUTES } from '../constants/routes';
import '../styles/SignUp/SignUp.css';

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  const handleGoogleSignUp = () => {
    // TODO: Implement Google OAuth flow
    console.log('Continue with Google clicked');
  };

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
              value="Sign up to start creating with AI"
              color="secondary"
            />
          </div>

          <div className="signup-google-container">
            <CustomButton
              variant="primary"
              text="Continue with Google"
              onClick={handleGoogleSignUp}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
