import { useEffect } from 'react';
import { useLocation } from 'wouter';

const ScrollToTop: React.FC = () => {
  const [location] = useLocation();

  // Effect that runs whenever the location changes
  useEffect(() => {
    // Scroll to the top of the page
    window.scrollTo(0, 0);
  }, [location]); // Re-run when location changes

  return null; // This component doesn't render anything
};

export default ScrollToTop;