import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const PageTransition = ({ children }) => {
  const location = useLocation();
  const [progressKey, setProgressKey] = useState(0);

  useEffect(() => {
    // Increment progressKey on every navigation to re-trigger the sleek top progress bar
    setProgressKey(prev => prev + 1);
    
    // Smooth scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, location.search]);

  return (
    <>
      {/* 1. Sleek Top Loading Route Progress Bar (YouTube/Next.js style) */}
      <div key={`progress-${progressKey}`} className="route-progress-bar" />

      {/* 2. Animated Page Content Container */}
      <div key={location.pathname} className="animate-page-enter w-full">
        {children}
      </div>
    </>
  );
};
