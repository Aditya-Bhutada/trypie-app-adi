
import { useEffect, useRef } from 'react';
import { useIsMobile } from './use-mobile';
import { useLocation } from 'react-router-dom';

export function useMobileFixes() {
  const isMobile = useIsMobile();
  const location = useLocation();
  const initialRender = useRef(true);
  
  // Scroll to top on page change, but not on initial render
  // Removed this effect to prevent unwanted scrolling
  
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
  
  // Fix for body scrolling issues on mobile
  useEffect(() => {
    if (isMobile) {
      // Prevent body from being fixed/unscrollable
      document.body.style.position = 'relative';
      document.body.style.overflow = 'auto';
      document.body.style.height = 'auto';
      
      // Ensure touchmove events aren't prevented
      const preventDefaultTouchMove = (e: TouchEvent) => {
        e.stopPropagation();
      };
      
      document.addEventListener('touchmove', preventDefaultTouchMove, { passive: false });
      
      return () => {
        document.removeEventListener('touchmove', preventDefaultTouchMove);
      };
    }
  }, [isMobile]);
  
  // Fix for mobile scrolling
  useEffect(() => {
    // Add touch scrolling to main elements
    const scrollableElements = document.querySelectorAll('main, .scrollable');
    
    scrollableElements.forEach(el => {
      if (el instanceof HTMLElement) {
        // Use setProperty instead of direct assignment for webkit prefixed properties
        el.style.setProperty('-webkit-overflow-scrolling', 'touch');
        el.style.overflowY = 'auto';
      }
    });
    
    // Prevent scroll memory on initial load
    if (history.scrollRestoration) {
      history.scrollRestoration = 'manual';
    }
    
    // Remove automatic scroll reset to prevent unwanted scrolling
    // window.scrollTo(0, 0); -- removed
  }, []);
  
  return null;
}

// Hook to integrate in Index.tsx and other major pages
export function MobileScrollFix() {
  useMobileFixes();
  return null;
}
