import React from 'react';

const GoldenCapsule = ({ width = 52, height = 22, label = 'Turmeric Capsule' }) => {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width, height }}
      title={label}
      aria-label={label}
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 52 22"
        fill="none"
        className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]"
      >
        <defs>
          <linearGradient id={`capsule-gold-${label}`} x1="0" x2="52" y1="0" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F9D776" />
            <stop offset="0.45" stopColor="#D5963B" />
            <stop offset="1" stopColor="#8B5E3C" />
          </linearGradient>
          <linearGradient id={`capsule-sheen-${label}`} x1="10" x2="18" y1="2" y2="16" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFF9D9" stopOpacity="0.9" />
            <stop offset="1" stopColor="#FFF9D9" stopOpacity="0" />
          </linearGradient>
        </defs>

        <ellipse cx="26" cy="11" rx="23" ry="10" fill={`url(#capsule-gold-${label})`} />
        <ellipse cx="18" cy="8" rx="8" ry="5" fill={`url(#capsule-sheen-${label})`} opacity="0.95" />
        <line x1="7" x1="11" x2="45" y2="11" stroke="#FFF4D1" strokeOpacity="0.35" strokeWidth="1" />
        <line x1="3" x1="19" x2="49" y2="19" stroke="#3B5335" strokeOpacity="0.4" strokeWidth="1" />
        <line x1="11" y1="1" x2="11" y2="21" stroke="#FFF9ED" strokeOpacity="0.2" strokeWidth="1" />
        <line x1="41" y1="1" x2="41" y2="21" stroke="#4D3012" strokeOpacity="0.3" strokeWidth="1" />
      </svg>
    </div>
  );
};

export default GoldenCapsule;
