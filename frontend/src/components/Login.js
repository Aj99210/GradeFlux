import React, { useEffect, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [animationLoaded, setAnimationLoaded] = useState(false);
  
  // Log the Google Client ID for debugging
  useEffect(() => {
    console.log("Login component - Google Client ID:", process.env.REACT_APP_GOOGLE_CLIENT_ID);
    
    // Trigger animations after component mounts
    setTimeout(() => {
      setAnimationLoaded(true);
    }, 100);
    
    // Add event listeners for parallax effect on shapes
    const handleMouseMove = (e) => {
      const shapes = document.querySelectorAll('.shape');
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      shapes.forEach((shape, index) => {
        const speed = 1 + index * 0.5;
        const xOffset = (x - 0.5) * speed * 20;
        const yOffset = (y - 0.5) * speed * 20;
        
        shape.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Hide scroll indicator when user scrolls down
    const handleScroll = () => {
      const scrollIndicator = document.querySelector('.scroll-indicator');
      if (scrollIndicator) {
        if (window.scrollY > 100) {
          scrollIndicator.classList.add('hidden');
        } else {
          scrollIndicator.classList.remove('hidden');
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleGoogleSuccess = (credentialResponse) => {
    // Decode the JWT token to get user info
    const token = credentialResponse.credential;
    console.log("Google login response:", credentialResponse);
    
    try {
      const decodedToken = decodeJwtToken(token);
      console.log("Decoded token:", decodedToken);
      
      const userData = {
        id: decodedToken.sub,
        name: decodedToken.name,
        email: decodedToken.email,
        picture: decodedToken.picture
      };
      
      onLoginSuccess(userData, token);
    } catch (error) {
      console.error("Error processing Google login:", error);
    }
  };
  
  const handleGoogleError = (error) => {
    console.error('Google Login Failed:', error);
  };
  
  // Add test login function to bypass Google authentication
  const handleTestLogin = () => {
    console.log("Using test login");
    const testUser = {
      id: 'test-123',
      name: 'Test Teacher',
      email: 'teacher@example.com',
      picture: ''
    };
    onLoginSuccess(testUser, 'test-token');
  };
  
  // Helper function to decode JWT token
  const decodeJwtToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return {};
    }
  };
  
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight * 0.8,
      behavior: 'smooth'
    });
  };
  
  return (
    <div className="login-page">
      <div className="login-background">
        <div className="animated-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>
      
      <div className={`login-content ${animationLoaded ? 'animate' : ''}`}>
        <div className="login-left">
          <div className="hero-content">
            <div className="logo-container">
              <div className="logo-mark">
                <span>G</span>
              </div>
              <h1 className="logo-text">GradeFlux</h1>
            </div>
            
            <h2 className="hero-title">AI-Powered Grading <br/><span>Simplified</span></h2>
            
            <p className="hero-subtitle">
              Automate your grading workflow, provide personalized feedback, 
              and save hours with seamless Google Classroom integration.
            </p>
            
            <div className="stats-container">
              <div className="stat-item">
                <span className="stat-number">70%</span>
                <span className="stat-label">Time Saved</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">98%</span>
                <span className="stat-label">Accuracy</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">5min</span>
                <span className="stat-label">Setup</span>
              </div>
            </div>
          </div>
          
          <div className="scroll-indicator" onClick={scrollToContent}>
            <span>Learn More</span>
            <div className="scroll-arrow"></div>
          </div>
        </div>
        
        <div className="login-right">
          <div className="login-card">
            <h3 className="card-title">Welcome Back</h3>
            <p className="card-subtitle">Sign in to continue your journey</p>
            
            <div className="login-illustration">
              <div className="illustration-container">
                <div className="floating-elements">
                  <div className="floating-element doc-1"></div>
                  <div className="floating-element doc-2"></div>
                  <div className="floating-element checkmark"></div>
                  <div className="floating-element grade-a"></div>
                </div>
              </div>
            </div>
            
            <div className="login-buttons">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="filled_blue"
                text="signin_with"
                shape="pill"
                size="large"
                width="100%"
              />
              
              <div className="divider">
                <span>or</span>
              </div>
              
              <button 
                onClick={handleTestLogin}
                className="test-login-button"
              >
                <span className="btn-icon"></span>
                Try Demo Mode
              </button>
            </div>
            
            <div className="feature-highlights">
              <div className="feature-item">
                <div className="feature-icon grade-icon"></div>
                <div className="feature-text">Auto-grade MCQs</div>
              </div>
              <div className="feature-item">
                <div className="feature-icon feedback-icon"></div>
                <div className="feature-text">Personalized feedback</div>
              </div>
              <div className="feature-item">
                <div className="feature-icon sync-icon"></div>
                <div className="feature-text">Classroom sync</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="login-footer">
        <p>© {new Date().getFullYear()} GradeFlux. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Login; 