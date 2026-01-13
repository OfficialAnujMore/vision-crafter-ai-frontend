import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import CustomText from '../components/CustomText';
import { LOGIN_PAGE } from '../utils/local/en';
import { ROUTES } from '../constants/routes';
import '../styles/Login/Login.css';
import { authService } from '../services/api/authService';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        setError('');
        console.log('Login:', { email, password, rememberMe });

        try {
            await authService.login({
                email, password
            })
            navigate(ROUTES.DASHBOARD)
        }
        catch (err: any) {
            console.log(err);

            const errorMessage = err.message || 'Login Failed';
            setError(errorMessage);
        }
    };

    return (
        <div className="login-container">
            {/* Left Side - Image and Text */}
            <div className="login-left">
                <div className="login-left-content">
                    <CustomText variant="h3" value="Vision Crafter AI" color="white" />
                    <CustomButton
                        variant="secondary"
                        text="Back to website →"
                        onClick={() => navigate(ROUTES.HOME)}
                    />
                </div>
                <div className="login-slogan">
                    <CustomText variant="h2" value="Transform Your Imagination Into Reality" color="white" />
                    <CustomText variant="h2" value="The future of editing with AI" color="white" />
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="login-right">
                <div className="login-form">
                    <div className="login-header">
                        <CustomText variant="h2" value={LOGIN_PAGE.title} color="white" />
                        <div className="login-subtext">
                            <CustomText
                                variant="p"
                                value={`${LOGIN_PAGE.subtitle}`}
                                color="secondary"
                            />
                            <CustomText
                                variant="p"
                                value={LOGIN_PAGE.signupLink}
                                color="primary"
                                onClick={() => navigate(ROUTES.SIGNUP)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="error-message" style={{ color: '#ff4444', marginBottom: '16px', padding: '8px', backgroundColor: 'rgba(255, 68, 68, 0.1)', borderRadius: '4px', fontSize: '14px' }}>
                            {error}
                        </div>
                    )}

                    <div className="form-fields">
                        <CustomInput
                            label={LOGIN_PAGE.emailLabel}
                            placeholder={LOGIN_PAGE.emailPlaceholder}
                            value={email}
                            onChange={setEmail}
                        />

                        <CustomInput
                            label={LOGIN_PAGE.passwordLabel}
                            placeholder={LOGIN_PAGE.passwordPlaceholder}
                            value={password}
                            onChange={setPassword}
                            isSecure
                        />

                        <div className="login-options">
                            <div className="remember-me">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <label htmlFor="rememberMe">
                                    <CustomText variant="caption" value={LOGIN_PAGE.rememberMe} color="secondary" />
                                </label>
                            </div>
                            <CustomText variant="caption" value={LOGIN_PAGE.forgotPassword} color="primary" />

                        </div>

                        <CustomButton
                            variant="primary"
                            text={LOGIN_PAGE.loginButton}
                            onClick={handleLogin}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

