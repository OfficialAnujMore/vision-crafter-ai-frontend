import React, { useState } from 'react';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import CustomText from '../components/CustomText';
import { REGISTER_PAGE } from '../utils/local/en';
import '../styles/Register/Register.css';

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleRegister = () => {
    if (!agreedToTerms) {
      alert(REGISTER_PAGE.termsRequiredAlert);
      return;
    }
    
    console.log('Register:', { firstName, lastName, email, password });
    // Add your registration logic here
  };

  return (
    <div className="register-container">
      {/* Left Side - Image and Text */}
      <div className="register-left">
        <div className="register-left-content">
          <CustomText variant="h3" value={REGISTER_PAGE.logo} color="white" />
          <CustomButton
            variant="primary"
            text={REGISTER_PAGE.backToWebsite}
            onClick={() => window.location.href = '/'}
          />
        </div>
        <div className="register-slogan">
          <CustomText variant="h2" value={REGISTER_PAGE.slogan1} color="white" />
          <CustomText variant="h2" value={REGISTER_PAGE.slogan2} color="white" />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="register-right">
        <div className="register-form">
          <div className="register-header">
            <CustomText variant="h2" value={REGISTER_PAGE.title} color="white" />
            <div className="register-subtext">
              <CustomText 
                variant="p" 
                value={`${REGISTER_PAGE.subtitle}`}
                color="secondary" 
              />
              <CustomText
                variant="p"
                value={REGISTER_PAGE.loginLink}
                color="primary"
                onClick={() => window.location.href = '/login'}
              />
            </div>
          </div>

          <div className="form-fields">
            <div className="name-row">
              <CustomInput
                label={REGISTER_PAGE.firstNameLabel}
                placeholder={REGISTER_PAGE.firstNamePlaceholder}
                value={firstName}
                onChange={setFirstName}
              />
              <CustomInput
                label={REGISTER_PAGE.lastNameLabel}
                placeholder={REGISTER_PAGE.lastNamePlaceholder}
                value={lastName}
                onChange={setLastName}
              />
            </div>

            <CustomInput
              label={REGISTER_PAGE.emailLabel}
              placeholder={REGISTER_PAGE.emailPlaceholder}
              value={email}
              onChange={setEmail}
            />

            <CustomInput
              label={REGISTER_PAGE.passwordLabel}
              placeholder={REGISTER_PAGE.passwordPlaceholder}
              value={password}
              onChange={setPassword}
              isSecure
            />

            <div className="terms-checkbox">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
              />
              <label htmlFor="terms">
                <CustomText 
                  variant="caption" 
                  value={
                    <>
                      {REGISTER_PAGE.termsPrefix}{' '}
                      <a href="/terms" className="terms-link">{REGISTER_PAGE.termsLink}</a>
                    </>
                  } 
                  color="secondary" 
                />
              </label>
            </div>

            <CustomButton
              variant="primary"
              text={REGISTER_PAGE.createAccountButton}
              onClick={handleRegister}
              disabled={!firstName || !lastName || !email || !password}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
