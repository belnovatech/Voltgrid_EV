import React from 'react';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="vg-footer">
      <div className="container">
        <p className="vg-footer__text">
          © {new Date().getFullYear()} Eway to Your EVs · Intelligent Electric Mobility & Fast-Charging Network
        </p>
      </div>
    </footer>
  );
};
