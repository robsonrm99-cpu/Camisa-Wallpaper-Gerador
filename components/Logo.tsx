import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Shield/Badge Shape */}
      <path 
        d="M50 95C50 95 90 80 90 25V10L50 2L10 10V25C10 80 50 95 50 95Z" 
        className="fill-emerald-500 stroke-emerald-300" 
        strokeWidth="4" 
      />
      
      {/* Jersey Silhouette */}
      <path 
        d="M30 35 L40 30 L50 32 L60 30 L70 35 V50 H65 V80 H35 V50 H30 V35 Z" 
        className="fill-slate-900 stroke-white" 
        strokeWidth="3" 
        strokeLinejoin="round"
      />
      
      {/* Stylized Number 10 / Stripes */}
      <path d="M45 45 V65" className="stroke-emerald-400" strokeWidth="4" strokeLinecap="round" />
      <path d="M55 45 V65" className="stroke-emerald-400" strokeWidth="4" strokeLinecap="round" />
      <path d="M35 80 H65" className="stroke-white" strokeWidth="2" />
    </svg>
  );
};