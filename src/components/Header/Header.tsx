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
        <Link to="/" className="vg-header__brand" aria-label="VoltGrid Home">
          <div className="vg-header__logo-icon" aria-hidden="true">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <span className="vg-header__brand-name">VoltGrid</span>
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
