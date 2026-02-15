
import { useEffect } from 'react';
import { useIsMobile } from './use-mobile';

export function useMobileFixes() {
  const isMobile = useIsMobile();
  
  // Fix for iOS mobile viewport height issues (100vh problem)
  useEffect(() => {
    const setVhProperty = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVhProperty();
    window.addEventListener('resize', setVhProperty);
    
    return () => {
      window.removeEventListener('resize', setVhProperty);
    };
  }, []);
  
  return null;
}

// Hook to integrate in Index.tsx and other major pages
export function MobileScrollFix() {
  useMobileFixes();
  return null;
}
