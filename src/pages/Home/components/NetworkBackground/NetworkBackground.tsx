import React from 'react';
import './NetworkBackground.css';

export const NetworkBackground: React.FC = () => {
  return (
    <div className="pg-network-bg" aria-hidden="true">
      {/* Ambient Gradient Glows */}
      <div className="pg-network-bg__glow pg-network-bg__glow--center" />
      <div className="pg-network-bg__glow pg-network-bg__glow--cyan" />

      {/* Abstract Infrastructure Orbit Vectors */}
      <svg
        className="pg-network-bg__svg"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <ellipse
          cx="720"
          cy="450"
          rx="680"
          ry="320"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <ellipse
          cx="720"
          cy="450"
          rx="520"
          ry="240"
          stroke="rgba(255, 255, 255, 0.07)"
          strokeWidth="1"
        />
        <ellipse
          cx="720"
          cy="450"
          rx="340"
          ry="160"
          stroke="rgba(154, 230, 0, 0.12)"
          strokeWidth="1.2"
        />
        
        {/* Subtle grid lines */}
        <line
          x1="0"
          y1="450"
          x2="1440"
          y2="450"
          stroke="rgba(255, 255, 255, 0.03)"
          strokeWidth="1"
        />
        <line
          x1="720"
          y1="0"
          x2="720"
          y2="900"
          stroke="rgba(255, 255, 255, 0.03)"
          strokeWidth="1"
        />

        {/* Small subtle telemetry nodes */}
        <circle cx="380" cy="450" r="3" fill="rgba(154, 230, 0, 0.4)" />
        <circle cx="1060" cy="450" r="3" fill="rgba(56, 189, 248, 0.4)" />
        <circle cx="720" cy="210" r="2.5" fill="rgba(255, 255, 255, 0.3)" />
        <circle cx="720" cy="690" r="2.5" fill="rgba(255, 255, 255, 0.3)" />
      </svg>
    </div>
  );
};
