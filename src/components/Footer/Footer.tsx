import React from 'react';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="vg-footer">
      <div className="container">
        <p className="vg-footer__text">
          VoltGrid demo prototype · pricing and locations are sample data
        </p>
      </div>
    </footer>
  );
};
