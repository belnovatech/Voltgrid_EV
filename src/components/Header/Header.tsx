import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../Button/Button';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logoutUser } = useAuth();

  const handleSignInClick = () => {
    navigate('/signin');
  };

  return (
    <header className="vg-header">
      <div className="container vg-header__container">
        <Link to="/" className="vg-header__brand" aria-label="Eway to Your EVs Home">
          <div className="vg-header__logo-wrap" style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
            <img
              src="/eway-logo.png"
              alt="Eway to Your EVs Logo"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <span className="vg-header__brand-name">Eway to Your EVs</span>
        </Link>

        <nav className="vg-header__nav" aria-label="Main Navigation">
          <button
            type="button"
            className="vg-header__nav-link"
            onClick={() => {
              // Navigation or placeholder for Admin console
              alert('Admin console is accessible to authorized operators.');
            }}
          >
            Admin console
          </button>

          {isAuthenticated ? (
            <div className="vg-header__auth-group">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/dashboard')}
              >
                My Account
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={logoutUser}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={handleSignInClick}
              className="vg-header__signin-btn"
            >
              Sign in
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};
